import {Router} from "express";
import {getAllClasses, getClassWithTrainers, getFeaturedClasses,} from "../controllers/classController.js";

const router = Router()

router.get("/", getAllClasses)
router.get("/featured", getFeaturedClasses)
router.get("/:id", getClassWithTrainers)

export default router;