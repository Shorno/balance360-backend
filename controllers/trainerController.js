import {TrainerApplication} from "../models/Trainer.js";

export const applyForTrainer = async (req, res) => {
    try {
        const {
            fullName,
            skills,
            availableDays,
            availableTime,
            age,
            yearsOfExperience,
            profileImage,
            email,
            details
        } = req.body;
        const application = await TrainerApplication.create({
            fullName,
            email,
            age,
            yearsOfExperience,
            profileImage,
            skills,
            availableDays,
            availableTime,
            details
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


