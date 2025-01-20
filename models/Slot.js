import {model, Schema} from 'mongoose';

const slotSchema = new Schema({
    slotName: {type: String, required: true},
    slotDuration: {type: String, required: true},
    selectedDays: {type: [String], required: true},
    selectedClass: {type: String, required: true},
    startTime: {type: String, required: true},
    additionalInfo: {type: String, required: true},
    trainerEmail: {type: String, required: true},
}, {
    timestamps: true
});

export const Slot = model('Slot', slotSchema);
