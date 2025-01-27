import {Router} from "express";
import {
    addClass,
    approveTrainerApplication, getApprovedTrainers, getDashboardData,
    getTrainerApplicationDetail,
    getTrainerApplications, rejectTrainerApplication, removeTrainerById
} from "../controllers/adminController.js";
import {authenticate} from "../middleware/auth.js";
import {checkRole} from "../middleware/checkRole.js";

const router = Router();

router.get('/trainer-applications', authenticate, getTrainerApplications);
router.get('/trainer-applications/:id', authenticate, checkRole("admin"), getTrainerApplicationDetail);
router.post('/trainer-applications/:id/approve', authenticate, checkRole("admin"), approveTrainerApplication);
router.get('/trainers', authenticate, checkRole("admin"), getApprovedTrainers);
router.post('/trainer-applications/:id/reject', authenticate, checkRole("admin"), rejectTrainerApplication);
router.post("/classes", authenticate, checkRole("admin"), addClass);
router.get("/statistics", authenticate, checkRole("admin"), getDashboardData)
router.delete("/trainers/:id", authenticate, checkRole("admin"), removeTrainerById)


export default router;