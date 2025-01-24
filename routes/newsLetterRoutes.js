import {Router} from "express";
import {subscribe} from "../controllers/newsLetterController.js";

const router = Router()


router.post("/subscribe", subscribe)


export default router;