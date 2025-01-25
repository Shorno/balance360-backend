import {Router} from "express";
import {createForum, getForumPosts, voteOnPost} from "../controllers/forumController.js";
import {verifyToken} from "../middleware/auth.js";

const router = Router()

router.post("/", createForum)
router.get("/", getForumPosts)
router.post('/:postId/vote', verifyToken, voteOnPost);



export default router;