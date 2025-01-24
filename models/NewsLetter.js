import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name : { type: String, required: true },
    subscribedAt: { type: Date, default: Date.now }
});

export const NewsLetter = mongoose.model('NewsLetter', newsletterSchema);