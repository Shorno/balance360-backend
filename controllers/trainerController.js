import {TrainerApplication} from "../models/Trainer.js";
import {User} from "../models/User.js";
import {Slot} from "../models/Slot.js";
import {Class} from "../models/Class.js";

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

export const getTrainerDetails = async (req, res) => {
    const {email} = req.params;
    console.log(email)

    try {
        const trainer = await TrainerApplication.findOne({
            email,
            status: 'approved'
        });

        if (!trainer) {
            return res.status(404).json({message: 'Trainer not found'});
        }
        res.json(trainer)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const addSlot = async (req, res) => {
    try {
        const {slotName, slotDuration, selectedDays, selectedClass, startTime, additionalInfo, trainerEmail} = req.body;


        const trainer = await User.findOne({email: trainerEmail}, {role: 'trainer'});
        if (!trainer) {
            return res.status(404).json({message: 'Trainer not found'});
        }

        const slot = await Slot.create({
            slotName,
            slotDuration,
            selectedDays,
            selectedClass,
            startTime,
            additionalInfo,
            trainerEmail
        });

        res.status(201).json(slot);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getTrainerSlots = async (req, res) => {
    const {email} = req.params;
    console.log(email)
    try {
        const slots = await Slot.find({trainerEmail: email});
        res.json(slots)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}