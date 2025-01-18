import {Router} from "express";
import {
    approveTrainerApplication, getApprovedTrainers,
    getTrainerApplicationDetail,
    getTrainerApplications, rejectTrainerApplication
} from "../controllers/adminController.js";

const router = Router();

router.get('/trainer-applications', getTrainerApplications);
router.get('/trainer-applications/:id', getTrainerApplicationDetail);
router.post('/trainer-applications/:id/approve', approveTrainerApplication);
router.get('/trainers', getApprovedTrainers);
router.post('/trainer-applications/:id/reject', rejectTrainerApplication);


export default router;