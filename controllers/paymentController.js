import Stripe from 'stripe';
import {Payment} from "../models/Payment.js";
import {Class} from "../models/Class.js";
import {Slot} from "../models/Slot.js";
import mongoose from "mongoose";
import {User} from "../models/User.js";

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

// export const confirmPayment = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//
//     try {
//         const { slotId, price, planName, trainerEmail, stripePaymentId , userEmail} = req.body;
//
//         const slot = await Slot.findById(slotId).session(session);
//         if (!slot) {
//             await session.abortTransaction();
//             return res.status(404).json({ error: 'Slot not found' });
//         }
//
//         const classExists = await Class.findOne({ name: slot.selectedClass }).session(session);
//         if (!classExists) {
//             await session.abortTransaction();
//             return res.status(404).json({ error: 'Class not found' });
//         }
//
//         const payment = await Payment.create([{
//             userEmail,
//             trainerEmail,
//             slotId,
//             package: planName,
//             amount: price,
//             stripeId: stripePaymentId,
//             status: 'succeeded'
//         }], { session });
//
//         // 4. Update slot
//         const updatedSlot = await Slot.findByIdAndUpdate(
//             slotId,
//             {
//                 $inc: { bookedCount: 1 },
//                 $set: {
//                     isAvailable: { $lt: ["$bookedCount", "$maxCapacity"] }
//                 }
//             },
//             { new: true, session }
//         );
//
//         await Class.findOneAndUpdate(
//             { name: slot.selectedClass },
//             { $inc: { bookingCount: 1 } },
//             { session }
//         );
//
//         await session.commitTransaction();
//         res.status(200).json({ success: true });
//
//     } catch (error) {
//         await session.abortTransaction();
//         console.error('Payment confirmation error:', error);
//         res.status(500).json({
//             error: 'Payment confirmation failed',
//             details: error.message
//         });
//     } finally {
//         session.endSession();
//     }
// };

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

        // 2. Get slot with transaction
        const slot = await Slot.findById(slotId).session(session);
        if (!slot) {
            await session.abortTransaction();
            return res.status(404).json({error: 'Slot not found'});
        }

        // 3. Create payment record
        const payment = await Payment.create([{
            userEmail,
            trainerEmail: slot.trainerEmail,
            slotId: slot._id,
            package: planName,
            amount: price,
            stripeId: stripePaymentId,
            status: 'succeeded'
        }], {session});

        // 4. Update user bookings
        const updatedUser = await User.findOneAndUpdate(
            {email: userEmail},
            {
                $push: {
                    bookings: {
                        slotId: slot._id,
                        trainerEmail: slot.trainerEmail,
                        paymentId: payment[0]._id,
                        bookingDate: new Date()
                    }
                }
            },
            {new: true, session}
        ).select('-password'); // Exclude sensitive fields

        // 5. Update slot
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

        // 6. Commit transaction
        await session.commitTransaction();

        res.status(200).json({
            success: true,
            user: updatedUser,
            payment: payment[0]
        });

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