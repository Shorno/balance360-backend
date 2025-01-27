import {Forum} from "../models/Forum.js";

export const createForum = async (req, res) => {
    console.log("createForum", req.body)
    try {
        const forum = await Forum.create(req.body);
        res.status(201).json(forum);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


export const getForumPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const total = await Forum.countDocuments();

        const forumPosts = await Forum.find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            data: forumPosts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


export const getLatestForumPosts = async (req, res) => {
    try {
        const forumPosts = await Forum.find()
            .sort({createdAt: -1})
            .limit(6);

        res.status(200).json(forumPosts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


export const voteOnPost = async (req, res) => {
    try {
        const {postId} = req.params;
        const {voteType, userEmail} = req.body;
        const post = await Forum.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const existingVote = post.votes.voters.find(v => v.email === userEmail);

        if (existingVote) {
            post.votes.upvotes -= existingVote.voteType === 'up' ? 1 : 0;
            post.votes.downvotes -= existingVote.voteType === 'down' ? 1 : 0;
            post.votes.voters = post.votes.voters.filter(v => v.email !== userEmail);

            if (existingVote.voteType === voteType) {
                await post.save();
                return res.json({
                    success: true,
                    upvotes: post.votes.upvotes,
                    downvotes: post.votes.downvotes,
                    userVote: null // Indicate no vote
                });
            }
        }

        post.votes.upvotes += voteType === 'up' ? 1 : 0;
        post.votes.downvotes += voteType === 'down' ? 1 : 0;
        post.votes.voters.push({email: userEmail, voteType});

        await post.save();
        res.json({
            success: true,
            upvotes: post.votes.upvotes,
            downvotes: post.votes.downvotes,
            userVote: voteType
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};