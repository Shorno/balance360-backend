import {Router} from "express";
import {makePayment} from "../controllers/paymentController.js";

const router = Router()

router.post('/create-payment-intent', makePayment);

export default router;