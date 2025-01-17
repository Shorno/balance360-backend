import {TrainerApplication} from "../models/Trainer.js";

export const getTrainerApplications = async (req, res) => {
    try {
        const applications = await TrainerApplication.find().sort({createdAt: -1});

        return res.status(201).json({
            status: 'success',
            data: applications,
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating or updating user',
            error: error.message
        });
    }
}

export const getTrainerApplicationDetail = async (req, res) => {
    try {
        const {id} = req.params;
        const application = await TrainerApplication.findById(id);

        if (!application) {
            return res.status(404).json({
                status: 'error',
                message: 'Application not found'
            });
        }

        return res.status(201).json({
            status: 'success',
            data: application,
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating or updating user',
            error: error.message
        });
    }
}