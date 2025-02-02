import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { createLayout, editLayout, getLayoutByType } from '../controllers/layoutController';

const layoutRouter = express.Router();

layoutRouter.post("/create-layout", isAuthenticated, createLayout);

layoutRouter.put("/edit-layout", isAuthenticated, editLayout);

layoutRouter.get("/get-layout/:type", getLayoutByType);

export default layoutRouter;