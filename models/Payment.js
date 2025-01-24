import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userEmail: {type: String, required: true},
    trainerEmail: {type: String, required: true},
    slotId: {type: mongoose.Schema.Types.ObjectId, required: true},
    package: {type: String, enum: ['Basic Membership', 'Standard Membership', 'Premium Membership'], required: true},
    amount: {type: Number, required: true},
    stripeId: {type: String, required: true},
    status: {type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending'}
}, {timestamps: true});

export const Payment = mongoose.model('Payment', paymentSchema);