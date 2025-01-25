import express from 'express';
import userRouter from './userRoutes';
import courseRouter from './courseRoutes';
import orderRouter from './orderRoutes';
import analyticsRouter from './analyticsRoutes';
import layoutRouter from './layoutRoutes';
import authRouter from './authRoutes';
import courseDataRouter from './courseDataRoutes';
import paymentRouter from './paymentRoutes';

const router = express.Router();

router.use(authRouter);
router.use(userRouter);
router.use(courseRouter);
router.use(courseDataRouter)
router.use(orderRouter);
router.use(analyticsRouter);
router.use(layoutRouter);
router.use(paymentRouter);

export default router;
