import {Review} from "../models/Review.js";
import {User} from "../models/User.js";

export const addReview = async (req, res) => {
    try {
        const {userEmail, trainerEmail, rating, comment} = req.body;

        const newReview = new Review({
            userEmail,
            trainerEmail,
            rating,
            comment
        });

        await newReview.save();

        await User.findOneAndUpdate(
            {email: userEmail},
            {
                $push: {
                    reviews: {
                        trainerEmail,
                        rating,
                        comment
                    }
                }
            },
            {new: true}
        );

        res.status(201).json({
            status: 'success',
            message: 'Review submitted successfully'
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};