import {Router} from "express";
import {
    getPaginatedClasses,
    getClassWithTrainers,
    getFeaturedClasses,
    getAllClasses, searchClasses,
} from "../controllers/classController.js";

const router = Router()

router.get("/", getPaginatedClasses)
router.get("/search", searchClasses)
router.get("/all", getAllClasses)
router.get("/featured", getFeaturedClasses)
router.get("/:id", getClassWithTrainers)

export default router;