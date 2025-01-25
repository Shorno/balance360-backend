import {Schema, model} from 'mongoose';

const forumSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    tags: { type: String, required: true },
    difficulty: { type: String, required: true },
    estimatedReadTime: { type: String, required: true },
    role: { type: String, required: true },
    votes: {
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
        voters: [{
            email: String,
            voteType: { type: String, enum: ['up', 'down'] }
        }]
    }
}, { timestamps: true });

export const Forum = model('Forum', forumSchema);