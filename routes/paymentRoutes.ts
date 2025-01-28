import { Router } from "express";
import { createPay } from "../controllers/paymentController";
import { isAuthenticated } from "../middleware/auth";

const paymentRouter = Router();

paymentRouter.route('/create-payment').post(createPay);

export default paymentRouter;