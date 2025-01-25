import {TrainerApplication} from "../models/Trainer.js";
import {User} from "../models/User.js";
import {Class} from "../models/Class.js";
import {Payment} from "../models/Payment.js";
import {NewsLetter} from "../models/NewsLetter.js";
import {Forum} from "../models/Forum.js";

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

export const getApprovedTrainers = async (req, res) => {
    try {
        const trainers = await TrainerApplication.find({status: 'approved'});

        return res.status(201).json({
            status: 'success',
            data: trainers,
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error getting approved trainers',
            error: error.message
        });
    }
}

export const rejectTrainerApplication = async (req, res) => {
    try {
        const {id} = req.params;
        const {rejectionReason} = req.body;

        const application = await TrainerApplication.findById(id);
        if (!application) {
            return res.status(404).json({message: 'Application not found'});
        }

        application.status = 'rejected';
        application.rejectionReason = rejectionReason;
        await application.save();

        res.json({message: 'Trainer application rejected'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


export const addClass = async (req, res) => {
    try {
        const newClass = await Class.create(req.body);
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


export const getDashboardData = async (req, res) => {
    try {
        const payments = await Payment.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {$sum: "$amount"},
                    totalTransactions: {$sum: 1}
                }
            }
        ]);

        const recentTransactions = await Payment.find()
            .sort({createdAt: -1})
            .limit(6)
            .select('userEmail amount package status createdAt');

        const totalMembers = await User.countDocuments({role: 'member'});
        const newsletterSubscribers = await NewsLetter.countDocuments();

        const paidMembers = await Payment.distinct('userEmail');

        res.status(200).json({
            totalMembers,
            totalRevenue: payments[0]?.totalRevenue || 0,
            recentTransactions,
            totalPaidMembers: paidMembers.length,
            newsletterSubscribers

        });

    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch dashboard data',
            details: error.message
        });
    }
};

