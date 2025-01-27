import {Router} from "express";
import {createForum, getForumPosts, getLatestForumPosts, voteOnPost} from "../controllers/forumController.js";
import {authenticate} from "../middleware/auth.js";
import {checkRole} from "../middleware/checkRole.js";

const router = Router()

router.post("/", authenticate, checkRole(["admin", "trainer"]), createForum)
router.get("/", getForumPosts)
router.get("/latest", getLatestForumPosts)
router.post('/:postId/vote', voteOnPost);


export default router;