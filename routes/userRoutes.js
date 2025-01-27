import {Router} from "express";
import {
    createOrUpdateUser, getAllUsers,
    getApplicationStatus,
    getRoleByEmail, getUserDetailsByEmail, getUsersWithReviews,
} from "../controllers/userController.js";

const router = Router();

router.post('/', createOrUpdateUser);
router.get("/role/:email", getRoleByEmail)
router.get("/application/:email", getApplicationStatus)
router.get("/info/:email", getUserDetailsByEmail)
router.get("/all", getAllUsers)
router.get("/reviews", getUsersWithReviews)


export default router;