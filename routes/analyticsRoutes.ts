import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from '../controllers/analyticsController';

const analyticsRouter = express.Router();
// temporarily removed isAuthenticated later add it
analyticsRouter.get('/get-users-analytics', getUserAnalytics);

analyticsRouter.get('/get-course-analytics', getCourseAnalytics);

analyticsRouter.get('/get-order-analytics', getOrderAnalytics);

export default analyticsRouter;