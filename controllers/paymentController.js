import Stripe from 'stripe';
import {Payment} from "../models/Payment.js";
import {Class} from "../models/Class.js";
import {Slot} from "../models/Slot.js";
import mongoose from "mongoose";
import {User} from "../models/User.js";
import {TrainerApplication} from "../models/Trainer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const makePayment = async (req, res) => {
    try {
        const {amount, planName} = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            metadata: {planName},
        });

        res.json({clientSecret: paymentIntent.client_secret});

    } catch (error) {
        res.status(500).json({error: 'Payment failed'});
    }
};


export const confirmPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {slotId, userEmail, price, planName, stripePaymentId} = req.body;

        // 1. Validate user exists
        const user = await User.findOne({email: userEmail}).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({error: 'User not found'});
        }

        // 2. Get slot with transaction and populate trainer details
        const slot = await Slot.findById(slotId)
            .session(session);
        if (!slot) {
            await session.abortTransaction();
            return res.status(404).json({error: 'Slot not found'});
        }

        // 3. Get trainer details
        const trainer = await TrainerApplication.findOne({email: slot.trainerEmail})
            .session(session);
        if (!trainer) {
            await session.abortTransaction();
            return res.status(404).json({error: 'Trainer not found'});
        }

        // 4. Create payment record
        const payment = await Payment.create([{
            userEmail,
            trainerEmail: slot.trainerEmail,
            slotId: slot._id,
            package: planName,
            amount: price,
            stripeId: stripePaymentId,
            status: 'succeeded'
        }], {session});

        // 5. Update user bookings with trainer and slot details
        const updatedUser = await User.findOneAndUpdate(
            {email: userEmail},
            {
                $push: {
                    bookings: {
                        slotId: slot._id,
                        trainerEmail: slot.trainerEmail,
                        trainerName: trainer.fullName,
                        trainerImage: trainer.profileImage,
                        slotName: slot.slotName,
                        slotTime: slot.startTime,
                        slotDuration: slot.slotDuration,
                        paymentId: payment[0]._id,
                        bookingDate: new Date()
                    }
                }
            },
            {new: true, session}
        ).select('-password');

        // 6. Update slot
        await Slot.findByIdAndUpdate(
            slotId,
            {
                $inc: {bookedCount: 1},
                $push: {
                    bookedUsers: {
                        userEmail: userEmail,
                        paymentId: payment[0]._id
                    }
                }
            },
            {session}
        );

        // 7. Update Class booking count
        await Class.findOneAndUpdate(
            { name: slot.selectedClass },
            { $inc: { bookingCount: 1 } },
            { session }
        );

        // 8. Commit transaction
        await session.commitTransaction();

        res.status(200).json({
            success: true,
            user: updatedUser,
            payment: payment[0]
        });

        console.log(updatedUser)

    } catch (error) {
        await session.abortTransaction();
        console.error('Payment Error:', error);
        res.status(500).json({
            success: false,
            error: 'Payment failed',
            details: error.message
        });
    } finally {
        session.endSession();
    }
};