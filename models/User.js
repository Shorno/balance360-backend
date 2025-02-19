import mongoose, {Schema} from 'mongoose';

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true
    },
    photoURL: {
        type: String,
    },
    role: {
        type: String,
        enum: ['member', 'trainer', 'admin'],
        default: 'member'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    bio: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
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
    }],
    reviews: [{
        trainerEmail: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});
export const User = mongoose.model('User', userSchema);