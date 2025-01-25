require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import catchAsyncError from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { verify } from "jsonwebtoken";
import { IUser, userModel } from "../models/userModel";

declare module 'express' {
    interface Request {
        user?: IUser | null
    }
}

export const isAuthenticated = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const access_token = await req.cookies.access_token as string;

        if (!access_token) {
            return next(
                new ErrorHandler("Access token expired", 400)
            );
        }

        const decoded: any = await verify(
            access_token,
            process.env.ACCESS_TOKEN_SECRET!! as string
        );

        if (!decoded) {
            return next(new ErrorHandler("access token is not valid", 400));
        }

        const user = await userModel.findById(decoded._id).select("-password -refreshToken");

        if (!user) {
            return next(
                new ErrorHandler("Please login to access this resource", 400)
            );
        }

        req.user = user;

        next();
    }
);


export const isAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'user') {
        next();
    }

    return next(new ErrorHandler(`${req.user?.role} not allowed to access these resources`, 403))
});