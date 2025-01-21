import {Router} from "express";
import {getAllClasses, getClassWithTrainers,} from "../controllers/classController.js";

const router = Router()

router.get("/", getAllClasses)
router.get("/:id", getClassWithTrainers)

export default router;