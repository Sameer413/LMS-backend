import Razorpay from "razorpay";
import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";


export const razorpay = new Razorpay({
    key_id: "rzp_test_OGZ7M7SEQajqtU",
    key_secret: "6HKTCVXInkJyKi8wzKMOizRv"
});

export const createPay = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount } = req.body;
        const amountValue = amount.amount;

        const option = {
            amount: Number(amountValue) * 100,
            currency: "INR"
        }
        console.log(option);

        const order = await razorpay.orders.create(option);


        res.status(200).json({
            success: true,
            order
        });

    } catch (error: any) {
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


