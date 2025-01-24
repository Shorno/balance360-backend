import Stripe from 'stripe';
import {Payment} from "../models/Payment.js";
import {Class} from "../models/Class.js";
import {Slot} from "../models/Slot.js";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const makePayment = async (req, res) => {
    try {
        const { amount, planName } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            metadata: { planName },
        });

        res.json({ clientSecret: paymentIntent.client_secret });

    } catch (error) {
        res.status(500).json({ error: 'Payment failed' });
    }
};

export const confirmPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { slotId, price, planName, trainerEmail, stripePaymentId , userEmail} = req.body;

        const slot = await Slot.findById(slotId).session(session);
        if (!slot) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Slot not found' });
        }

        const classExists = await Class.findOne({ name: slot.selectedClass }).session(session);
        if (!classExists) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Class not found' });
        }

        const payment = await Payment.create([{
            userEmail,
            trainerEmail,
            slotId,
            package: planName,
            amount: price,
            stripeId: stripePaymentId,
            status: 'succeeded'
        }], { session });

        // 4. Update slot
        const updatedSlot = await Slot.findByIdAndUpdate(
            slotId,
            {
                $inc: { bookedCount: 1 },
                $set: {
                    isAvailable: { $lt: ["$bookedCount", "$maxCapacity"] }
                }
            },
            { new: true, session }
        );

        await Class.findOneAndUpdate(
            { name: slot.selectedClass },
            { $inc: { bookingCount: 1 } },
            { session }
        );

        await session.commitTransaction();
        res.status(200).json({ success: true });

    } catch (error) {
        await session.abortTransaction();
        console.error('Payment confirmation error:', error);
        res.status(500).json({
            error: 'Payment confirmation failed',
            details: error.message
        });
    } finally {
        session.endSession();
    }
};