import {Router} from "express";
import {
    getPaginatedClasses,
    getClassWithTrainers,
    getFeaturedClasses,
    getAllClasses,
} from "../controllers/classController.js";

const router = Router()

router.get("/", getPaginatedClasses)
router.get("/all", getAllClasses)
router.get("/featured", getFeaturedClasses)
router.get("/:id", getClassWithTrainers)

export default router;