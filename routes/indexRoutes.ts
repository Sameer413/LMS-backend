import express from 'express';
import userRouter from './userRoutes';
import courseRouter from './courseRoutes';
import orderRouter from './orderRoutes';
import analyticsRouter from './analyticsRoutes';
import layoutRouter from './layoutRoutes';
const router = express.Router();

router.use(userRouter);
router.use(courseRouter);
router.use(orderRouter);
router.use(analyticsRouter);
router.use(layoutRouter);
export default router;