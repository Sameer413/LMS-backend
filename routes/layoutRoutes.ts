import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { addCategories, addFaqs, getLayout } from '../controllers/layoutController';

const layoutRouter = express.Router();

layoutRouter.post('/add-categories', isAuthenticated, addCategories);
layoutRouter.post('/add-faq', isAuthenticated, addFaqs);
layoutRouter.get('/get-layout', isAuthenticated, getLayout);

export default layoutRouter;