import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import razorPay from "../utils/razorPay";
import { OrderModel } from "../models/orderModel";

export const createPay = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, courseId } = req.body;
        const userId = req.user?._id || "67889683c30e352db02e9df5"

        const order = await razorPay.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: `order_rcpid_${Date.now()}`
        });

        if (!order) {
            return next(new ErrorHandler("Failed to create an payment", 400))
        }

        const newOrder = await OrderModel.create({
            payId: order.id,
            courseId: courseId,
            userId: userId,
            receipt: order.receipt,
            amount: Number(order.amount) / 100,
            currency: order.currency,
            user: req.user?._id, // Link this order to the user
            status: 'created',
        });

        if (!newOrder) {
            return next(new ErrorHandler("Failed to create an order", 400))
        }

        res.status(200).json({
            success: true,
            order,
            newOrder
        });

    } catch (error: any) {
        console.log(error);

        return next(new ErrorHandler(error.message, 500));
    }
});

export const paymentVerification = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        res.status(200).json({
            success: true,

        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const testPay = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const payment = await razorPay.payments.fetch("pay_NwReNX921zpwXz");

        res.status(200).json({
            success: true,
            payment
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


