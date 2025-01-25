import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import razorPay from "../utils/razorPay";

export const createPay = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount } = req.body;

        const order = await razorPay.orders.create({
            amount: amount * 100,
            currency: 'INR',
            receipt: `order_rcpid_${Date.now()}`
        });


        res.status(200).json({
            success: true,
            order
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

        const payment = await razorpay.payments.fetch("pay_NwReNX921zpwXz");

        res.status(200).json({
            success: true,
            payment
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


