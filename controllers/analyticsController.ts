import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { generateLast12MonthsData } from "../utils/analyticsGenerator";
import { userModel } from "../models/userModel";
import { CourseModel } from "../models/courseModel";
import { OrderModel } from "../models/orderModel";


export const getUserAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const users = await generateLast12MonthsData(userModel as any);

        res.status(200).json({
            success: true,
            users,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getCourseAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const course = await generateLast12MonthsData(CourseModel as any);

        res.status(200).json({
            success: true,
            course,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getOrderAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const orders = await generateLast12MonthsData(OrderModel as any);

        res.status(200).json({
            success: true,
            orders,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});