import {Router} from "express";
import {confirmPayment, makePayment} from "../controllers/paymentController.js";
import {authenticate} from "../middleware/auth.js";

const router = Router()

router.post('/create-payment-intent', authenticate, makePayment);
router.post('/confirm', authenticate, confirmPayment);

export default router;