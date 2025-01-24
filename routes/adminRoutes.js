import {Router} from "express";
import {
    addClass,
    approveTrainerApplication, getApprovedTrainers, getDashboardData,
    getTrainerApplicationDetail,
    getTrainerApplications, rejectTrainerApplication
} from "../controllers/adminController.js";

const router = Router();

router.get('/trainer-applications', getTrainerApplications);
router.get('/trainer-applications/:id', getTrainerApplicationDetail);
router.post('/trainer-applications/:id/approve', approveTrainerApplication);
router.get('/trainers', getApprovedTrainers);
router.post('/trainer-applications/:id/reject', rejectTrainerApplication);
router.post("/classes", addClass);
router.get("/statistics", getDashboardData)


export default router;