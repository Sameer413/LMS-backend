import { Router } from "express";
import { createPay } from "../controllers/paymentController";

const paymentRouter = Router();

paymentRouter.route('/create-payment').post(createPay);

export default paymentRouter;