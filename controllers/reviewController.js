import {Review} from "../models/Review.js";

export const addReview = async (req, res) => {
    try {
        const {userEmail, trainerEmail, rating, comment} = req.body;

        const review = await Review.create({
            userEmail,
            trainerEmail,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}