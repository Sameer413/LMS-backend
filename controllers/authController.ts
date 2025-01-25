
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import sendToken from "../middleware/sendToken";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/userModel";
import bcrypt from "bcryptjs";
import { JwtPayload, verify } from "jsonwebtoken";



interface authBody {
    username?: string;
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

// Sign Up User
export const signUp = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password, confirmPassword } = req.body as authBody;

        if (!username || !email || !password || !confirmPassword) {
            return next(new ErrorHandler("Enter all fields!", 400));
        }

        const existUser = await userModel.findOne({
            $or: [
                { email }, { username }
            ]
        });

        if (existUser) {
            if (existUser) {
                // Check whether it’s an email or username conflict
                if (existUser.email === email) {
                    return next(new ErrorHandler(`Email "${email}" is already in use`, 400));
                }
                if (existUser.username === username) {
                    return next(new ErrorHandler(`Username "${username}" is already taken`, 400));
                }
            }
        }

        if (password !== confirmPassword) {
            return next(new ErrorHandler("password not matching", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(200).json({
            success: true,
            message: "User Signed Up!",
            newUser,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Sign In User
export const signIn = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as authBody;

        if (!email || !password) {
            return next(new ErrorHandler("Enter all fields!", 400));
        }

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found!", 400));
        }

        const matchPassword = bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return next(new ErrorHandler("Enter correct password!", 400));
        }

        const accessToken = generateAccessToken({ _id: user._id });
        const refreshToken = generateRefreshToken({ _id: user._id });

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200)
            .cookie('access_token', accessToken, {
                // expires: new Date(Date.now() + 3 * 60 * 1000),
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                // httpOnly: true,
                // secure: true,
                // sameSite: 'none'
            }).cookie('refresh_token', refreshToken, {
                expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                // httpOnly: true,
                // sameSite: 'strict',
                // secure: true,
            })
            .json({
                success: true,
                message: `Welcome Back ${user?.name || 'Bro'}`,
                data: {
                    accessToken,
                    refreshToken,
                }
            });

        // sendToken(res, user, `Welcome Back ${user?.name || 'Bro'}`);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Sign Out User
export const signOut = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies?.refresh_token;

        if (!refreshToken) {
            return next(new ErrorHandler('No refresh token provide', 404));
        }

        const user = await userModel.findOne({ refreshToken })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove the refresh token from the database
        user.refreshToken = undefined;
        await user.save();

        // Clear cookies
        res.clearCookie("refresh_token", { httpOnly: true, secure: true });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const refreshToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.cookies.refresh_token || req.body.refresh_token;

    if (!refresh_token) {
        return next(new ErrorHandler("Unauthorized request", 401));
    }

    try {
        const decoded = verify(
            refresh_token,
            process.env.REFRESH_TOKEN_SECRET!
        ) as JwtPayload;

        // Ensure decoded payload contains the correct id property
        const userId = decoded._id;

        if (!userId) {
            return next(new ErrorHandler("Invalid token", 401));
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return next(
                new ErrorHandler("Please log in to access this resource", 400)
            );
        }

        // Generate new access and refresh tokens
        const accessToken = generateAccessToken({ _id: user._id as string });
        const newRefreshToken = generateRefreshToken({ _id: user._id as string });

        await user.updateOne({
            refresh_token: newRefreshToken,
        });
        await user.save();

        // Set cookies with new tokens
        res.cookie("access_token", accessToken, {
            // httpOnly: true,
            // sameSite: "strict",
            // maxAge: 3 * 60 * 1000
            maxAge: 2 * 24 * 60 * 60 * 1000
        });
        res.cookie("refresh_token", newRefreshToken, {
            // httpOnly: true,
            // sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000
        });

        // // Send response with new tokens
        // res.status(200).json({
        //     success: true,
        //     accessToken,
        //     refreshToken: newRefreshToken,
        // });

        next()
    } catch (error: any) {
        return next(
            new ErrorHandler("Token verification failed. Please log in again.", 401)
        );
    }
})