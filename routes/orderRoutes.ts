import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { createOrder } from '../controllers/orderController';
import { createPay, paymentVerification, testPay } from '../controllers/paymentController';

const orderRouter = express.Router();

orderRouter.post('/order-create', isAuthenticated, createOrder);
orderRouter.post('/create-pay', createPay);
orderRouter.post('/payment-verification', paymentVerification);
orderRouter.post('/testpay', testPay);

export default orderRouter;