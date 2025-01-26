import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userEmail: {type: String, required: true},
    trainerEmail: {type: String, required: true},
    rating: {type: Number, required: true},
    comment: {type: String, required: true}
}, {timestamps: true});

export const Review = mongoose.model('Review', reviewSchema);