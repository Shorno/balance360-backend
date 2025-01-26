import {Router} from 'express';
import {
    addSlot,
    applyForTrainer,
    getTrainerDetails,
    getTrainerSlots,
    getTrainerSlotsDetails
} from "../controllers/trainerController.js";


const router = Router();

router.post('/apply', applyForTrainer);

router.get('/:email', getTrainerDetails);

router.post('/slots', addSlot);

router.get('/slots/:email', getTrainerSlots);
router.get('/slots/details/:email', getTrainerSlotsDetails);




export default router;