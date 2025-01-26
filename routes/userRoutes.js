import {Router} from "express";
import {
    createOrUpdateUser,
    getApplicationStatus,
    getRoleByEmail, getUserDetailsByEmail,
} from "../controllers/userController.js";

const router = Router();

router.post('/', createOrUpdateUser);
router.get("/role/:email", getRoleByEmail)
router.get("/application/:email", getApplicationStatus)
router.get("/info/:email", getUserDetailsByEmail)


export default router;