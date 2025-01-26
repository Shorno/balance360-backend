import express, {Router} from "express";
import {addReview} from "../controllers/reviewController.js";


const router = Router()

router.post("/", addReview)

export default router;