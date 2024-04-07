import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder, OrderModel } from "../models/orderModel";
import { userModel } from "../models/userModel";
import { CourseModel } from "../models/courseModel";

export const createOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { courseId, payment_info } = req.body as IOrder;

        const user = await userModel.findById(req.user?._id);

        const courseExistInUser = user?.courses.some((course: any) => course._id.toString() === courseId);

        if (courseExistInUser) {
            return next(new ErrorHandler("You have already purchased this course", 400));
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const data: any = {
            courseId: course._id,
            userId: user?._id,
        }

        user?.courses.push(course?._id);

        await user?.save();

        course.purchased ? course.purchased += 1 : course.purchased;

        await course.save();

        await OrderModel.create(
            data
        );

        res.status(201).json({
            success: true,
            data,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.messaage, 500));
    }
});

export const getAllOrders = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await OrderModel.find({});

        if (!orders) {
            return next(new ErrorHandler("Orders not found", 404));
        }

        res.status(200).json({
            success: true,
            orders,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.messaage, 500));
    }
});
