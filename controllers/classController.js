import {Class} from "../models/Class.js";
import {Slot} from "../models/Slot.js";
import {User} from "../models/User.js";
import {TrainerApplication} from "../models/Trainer.js";

export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find();
        return res.status(200).json({
            status: 'success',
            data: classes,
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const getClassWithTrainers = async (req, res) => {
    try {
        const classId = req.params.id;
        const foundClass = await Class.findById(classId);
        if (!foundClass) {
            return res.status(404).json({message: 'Class not found'});
        }

        const slots = await Slot.find({selectedClass: foundClass.name});

        const trainerEmails = [...new Set(slots.map(slot => slot.trainerEmail))];

        const trainers = await TrainerApplication.find(
            {
                email: {$in: trainerEmails},
                status: 'approved'
            },
            {
                email: 1,
                fullName: 1,
                profileImage: 1,
                _id: 1
            }
        );

        const response = {
            ...foundClass.toObject(),
            trainers: trainers || []
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};