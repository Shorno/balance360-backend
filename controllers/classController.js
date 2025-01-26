import {Class} from "../models/Class.js";
import {Slot} from "../models/Slot.js";
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


export const getFeaturedClasses = async (req, res) => {
    try {
        // Add explicit projection
        const topClasses = await Class.find({}, null, {
            sort: { bookingCount: -1 },
            limit: 6,
            collation: { locale: 'en', strength: 2 } // Case-insensitive sorting
        });

        if(!topClasses?.length) {
            return res.status(404).json({
                status: 'success',
                message: 'No classes found',
                data: []
            });
        }

        console.log('Fetched classes:', topClasses); // Debug log

        return res.status(200).json({
            status: 'success',
            data: topClasses
        });

    } catch (error) {
        console.error('Error fetching classes:', error);
        return res.status(500).json({
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
}
