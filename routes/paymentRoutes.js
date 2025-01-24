import {Router} from "express";
import {confirmPayment, makePayment} from "../controllers/paymentController.js";
import {verifyToken} from "../middleware/auth.js";

const router = Router()

router.post('/create-payment-intent', makePayment);
router.post('/confirm', verifyToken, confirmPayment);

export default router;