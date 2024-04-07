import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import { LayoutModel } from "../models/layoutModel";
import ErrorHandler from "../utils/ErrorHandler";

export const addCategories = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    try {
        const layout = await LayoutModel.findOne({});

        const { categories } = req.body;

        if (!layout) {
            await LayoutModel.create({
                categories: categories,
            });
        } else {
            layout.categories = categories;

            await layout.save();
        }

        res.status(200).json({
            success: true,
            message: "Categories Successfully Added!",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const addFaqs = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    try {
        let layout = await LayoutModel.findOne({});

        const { faqs } = req.body;

        if (!layout) {
            layout = await LayoutModel.create({});
        }

        // Update the faq field with the new FAQs
        layout.faq = faqs;

        // Save the updated layout
        await layout.save();

        res.status(200).json({
            success: true,
            message: "FAQ Successfully Added!",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    try {
        const layout = await LayoutModel.findOne({});

        res.status(200).json({
            success: true,
            layout,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});