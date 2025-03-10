import jwt from "jsonwebtoken";
import {User} from "../models/User.js";
import {TrainerApplication} from "../models/Trainer.js";

const generateToken = (user) => {
    return jwt.sign({user: user.email}, process.env.JWT_SECRET, {expiresIn: '7d'});
};


export const createOrUpdateUser = async (req, res) => {
    const {email, displayName, photoURL, bio, location, website} = req.body;

    console.log(req.body);

    if (!email || !displayName || !photoURL) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide the required fields'
        });
    }

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            const result = await User.findOneAndUpdate(
                {email},
                {
                    $set: {
                        displayName,
                        photoURL,
                        bio,
                        location,
                        website,
                    }
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }
            );

            const token = generateToken(result);
            return res.status(200).json({
                status: 'success',
                data: result,
                token
            });
        } else {

            const newUser = new User({
                email,
                displayName,
                photoURL,
            });
            const result = await newUser.save();
            const token = generateToken(result);

            return res.status(201).json({
                status: 'success',
                data: result,
                token
            });
        }


    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating or updating user',
            error: error.message
        });
    }
};

export const getRoleByEmail = async (req, res) => {
    const {email} = req.params;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json({role: user.role});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getApplicationStatus = async (req, res) => {
    const {email} = req.params;
    try {
        const application = await TrainerApplication.findOne({email});
        if (!application) {
            return res.status(404).json({message: 'Application not found'});
        }
        res.json({
            status: "success",
            data: application
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const getUserDetailsByEmail = async (req, res) => {
    const {email} = req.params;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getUsersWithReviews = async (req, res) => {
    try {
        const users = await User.aggregate([
            {$match: {reviews: {$exists: true, $not: {$size: 0}}}},

            {$unwind: "$reviews"},

            {
                $addFields: {
                    "reviews.slotName": {
                        $let: {
                            vars: {
                                matchedBooking: {
                                    $filter: {
                                        input: "$bookings",
                                        as: "booking",
                                        cond: {
                                            $eq: ["$$booking.trainerEmail", "$reviews.trainerEmail"]
                                        }
                                    }
                                }
                            },
                            in: {
                                $ifNull: [
                                    {$arrayElemAt: ["$$matchedBooking.slotName", 0]},
                                    "N/A"
                                ]
                            }
                        }
                    }
                }
            },

            {
                $group: {
                    _id: "$_id",
                    displayName: {$first: "$displayName"},
                    email: {$first: "$email"},
                    photoURL: {$first: "$photoURL"},
                    reviews: {$push: "$reviews"}
                }
            },

            {$match: {"reviews.slotName": {$ne: "N/A"}}}
        ]);

        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};