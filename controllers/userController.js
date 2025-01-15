import User from '../models/User.js';
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign({user: user.email}, process.env.JWT_SECRET, {expiresIn: '7d'});
};
export const createOrUpdateUser = async (req, res) => {
    const {email, displayName, photoURL} = req.body;

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