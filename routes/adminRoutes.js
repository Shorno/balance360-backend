import {Router} from "express";
import {
    approveTrainerApplication,
    getTrainerApplicationDetail,
    getTrainerApplications
} from "../controllers/adminController.js";

const router = Router();

router.get('/trainer-applications', getTrainerApplications);
router.get('/trainer-applications/:id', getTrainerApplicationDetail);
router.post('/trainer-applications/:id/approve', approveTrainerApplication);


export default router;