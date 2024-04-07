require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import catchAsyncError from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from "jsonwebtoken";
import { IUser, userModel } from "../models/userModel";

declare module 'express' {
    interface Request {
        user?: IUser | null
    }
}

export const isAuthenticated = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler('Please Login to access', 400));
    }

    const decodedData: any = jwt.verify(token, process.env.JWT_SECRET || '');

    req.user = await userModel.findById(decodedData.id);

    next();
});


export const isAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'user') {
        next();
    }

    return next(new ErrorHandler(`${req.user?.role} not allowed to access these resources`, 403))
});