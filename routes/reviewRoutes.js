import {Router} from "express";
import {addReview} from "../controllers/reviewController.js";
import {authenticate} from "../middleware/auth.js";


const router = Router()

router.post("/", authenticate, addReview)

export default router;