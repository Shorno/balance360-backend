import mongoose from 'mongoose';

const trainerApplicationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profileImage : {
        type: String,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    availableDays: {
        type: [String],
    },
    availableTime: {
        type: String
    },
    age: {
        type: Number,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    details: {
        type: String
    },
    rejectionReason: {
        type: String
    }
}, {
    timestamps: true
});

export const TrainerApplication = mongoose.model('TrainerApplication', trainerApplicationSchema);