import {Router} from "express";
import {getApprovedTrainers} from "../controllers/adminController.js";
import {getFeaturedTrainers} from "../controllers/trainerController.js";
import {getPaginatedClasses} from "../controllers/classController.js";

const router = Router()

router.get("/trainers", getApprovedTrainers)
router.get("/trainers/featured", getFeaturedTrainers)
router.get("/classes", getPaginatedClasses)


export default router;