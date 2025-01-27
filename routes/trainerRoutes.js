import {Router} from 'express';
import {
    addSlot,
    applyForTrainer, deleteSlot,
    getTrainerDetails,
    getTrainerSlots,
    getTrainerSlotsDetails
} from "../controllers/trainerController.js";
import {authenticate} from "../middleware/auth.js";
import {checkRole} from "../middleware/checkRole.js";

const router = Router();

router.post('/apply', authenticate, applyForTrainer);
router.get('/:email', getTrainerDetails);
router.post('/slots', authenticate, checkRole("trainer"), addSlot);
router.get('/slots/:email', getTrainerSlots);
router.get('/slots/details/:email', getTrainerSlotsDetails);
router.delete('/slots/:id', deleteSlot);


export default router;