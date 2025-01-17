import {TrainerApplication} from "../models/Trainer.js";
import {User} from "../models/User.js";

export const getTrainerApplications = async (req, res) => {
    try {
        const applications = await TrainerApplication.find({status: "pending"}).sort({createdAt: -1});

        return res.status(201).json({
            status: 'success',
            data: applications,
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error getting trainer applications',
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


export const approveTrainerApplication = async (req, res) => {
    try {
        const {id} = req.params;
        console.log("approve id", id)
        const application = await TrainerApplication.findById(id);
        if (!application) {
            return res.status(404).json({message: 'Application not found'});
        }

        // Update user role in Users collection
        const user = await User.findOneAndUpdate(
            {email: application.email},
            {role: 'trainer'},
            {new: true}
        );

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        // Just update the application status
        application.status = 'approved';
        await application.save();

        res.json({
            message: 'Trainer application approved successfully',
            data: user // Return updated user data
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};