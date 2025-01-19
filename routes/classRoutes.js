import {Router} from "express";
import {getAllClasses} from "../controllers/classController.js";

const router = Router()

router.get("/", getAllClasses)

export default  router;