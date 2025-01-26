import mongoose, {model, Schema} from 'mongoose';

const slotSchema = new Schema({
    slotName: {type: String, required: true},
    slotDuration: {type: String, required: true},
    selectedDays: {type: [String], required: true},
    selectedClass: {type: String, required: true},
    startTime: {type: String, required: true},
    additionalInfo: {type: String, required: true},
    trainerEmail: {type: String, required: true},
    bookedCount: {type: Number, default: 0},
    bookings: [{
        slotId: { type: Schema.Types.ObjectId, ref: 'Slot' },
        trainerEmail: String,
        trainerName: String,
        trainerImage: String,
        slotName: String,
        slotTime: String,
        slotDuration: String,
        paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
        bookingDate: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

export const Slot = model('Slot', slotSchema);