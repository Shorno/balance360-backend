import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    maxParticipants: {
        type: Number,
        required: true
    },
    intensity: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    trainers: {type: [String], default: []},

})

export const Class = mongoose.model('Class', classSchema);