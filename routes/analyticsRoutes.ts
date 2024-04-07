import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from '../controllers/analyticsController';

const analyticsRouter = express.Router();

analyticsRouter.get('/get-users-analytics', isAuthenticated, getUserAnalytics);

analyticsRouter.get('/get-course-analytics', isAuthenticated, getCourseAnalytics);

analyticsRouter.get('/get-order-analytics', isAuthenticated, getOrderAnalytics);

export default analyticsRouter;