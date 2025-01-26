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
    bookedUsers: [{
        userEmail: {type: String, required: true},
        paymentId: {type: Schema.Types.ObjectId, ref: 'Payment', required: true},
        bookingDate: {type: Date, default: Date.now}
    }]
}, {
    timestamps: true
});

export const Slot = model('Slot', slotSchema);