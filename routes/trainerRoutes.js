import {Router} from 'express';
import {addSlot, applyForTrainer, getTrainerDetails, getTrainerSlots} from "../controllers/trainerController.js";


const router = Router();

// Trainer application
router.post('/apply', applyForTrainer);

router.get('/:email', getTrainerDetails);

router.post('/slots', addSlot);

router.get('/slots/:email', getTrainerSlots);




export default router;