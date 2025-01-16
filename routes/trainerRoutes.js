import { Router } from 'express';
import {applyForTrainer} from "../controllers/trainerController.js";


const router = Router();

// Trainer application
router.post('/apply',applyForTrainer);



export default router;