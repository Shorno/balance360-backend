import {Router} from "express";
import {getAllSubscribers, subscribe} from "../controllers/newsLetterController.js";

const router = Router()


router.post("/subscribe", subscribe)
router.get("/subscribers", getAllSubscribers)


export default router;