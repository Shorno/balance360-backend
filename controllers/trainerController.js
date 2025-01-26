import {TrainerApplication} from "../models/Trainer.js";
import {User} from "../models/User.js";
import {Slot} from "../models/Slot.js";

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

export const getTrainerSlotsDetails = async (req, res) => {
    try {
        const slots = await Slot.find({trainerEmail: req.params.email}).lean();
        console.log(slots);

        const userEmails = [...new Set(slots.flatMap(slot =>
            (slot.bookedUsers || []).map(user => user.userEmail)
        ))];

        const users = await User.find({email: {$in: userEmails}})
            .select('displayName email photoURL phone')
            .lean();

        const slotsWithUsers = slots.map(slot => ({
            ...slot,
            bookedUsers: (slot.bookedUsers || []).map(bookedUser => ({
                ...bookedUser,
                userDetails: users.find(u => u.email === bookedUser.userEmail)
            }))
        }));

        res.status(200).json({
            status: 'success',
            data: slotsWithUsers
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};