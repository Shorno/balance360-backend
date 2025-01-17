import {Router} from "express";
import {getTrainerApplicationDetail, getTrainerApplications} from "../controllers/adminController.js";

const router = Router();

router.get('/trainer-applications', getTrainerApplications);
router.get('/trainer-applications/:id', getTrainerApplicationDetail);


export default router;