import {Router} from "express";
import {
    createOrUpdateUser,
    getApplicationStatus,
    getRoleByEmail,
} from "../controllers/userController.js";

const router = Router();

router.post('/', createOrUpdateUser);
router.get("/role/:email", getRoleByEmail)
router.get("/application/:email", getApplicationStatus)


export default router;