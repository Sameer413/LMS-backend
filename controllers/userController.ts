import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { IUser, userModel } from "../models/userModel";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary";
import { getDataUri } from "../utils/dataUri";

// Update User Paassword
interface updatePasswordBody {
    password: string;
    newPassword: string;
    confirmPassword: string;
}

export const updatePassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, newPassword, confirmPassword } = req.body as updatePasswordBody;

        if (!password || !newPassword || !confirmPassword) {
            return next(new ErrorHandler("Enter all fields!", 400));
        }

        const user: IUser = await userModel.findById(req.user?._id).select("+password");
        if (!user) {
            return next(new ErrorHandler('User not found!', 404));
        }

        const isMatch = await bcrypt.compare(password, user?.password || '');
        if (!isMatch) {
            return next(new ErrorHandler("Enter correct password!", 400));
        }

        if (newPassword !== confirmPassword) {
            return next(new ErrorHandler('newPassword and confirmPassword not matching', 400));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            success: true,
            messaage: 'Password updated successfully!'
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get User Details
export const userDetail = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.findById(req.user?._id).select("-password");

        if (!user) {
            return next(new ErrorHandler("User not found!", 400));
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete User
export const deleteUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.findById(req.user?._id);

        if (!user) {
            return next(new ErrorHandler("User not found!", 400));
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            user,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Update user profile name, profile
export const updateProfile = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const { name } = req.body;
        const avatar = req.file;

        const user = await userModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found!", 404));
        }

        user.name = name ? name : user.name;

        if (avatar) {
            const fileUri = await getDataUri(avatar);

            if (!user.avatar?.public_id && !user.avatar?.url) {

                const myCloud = await cloudinary.uploader.upload(fileUri.content || '', {
                    folder: 'avatars'
                });

                if (user.avatar) {
                    user.avatar.url = myCloud.secure_url;
                    user.avatar.public_id = myCloud.public_id;
                }

            } else {

                await cloudinary.uploader.destroy(user.avatar.public_id || '');

                const myCloud = await cloudinary.uploader.upload(fileUri.content || '', {
                    folder: 'avatars'
                });

                if (user.avatar) {
                    user.avatar.url = myCloud.secure_url;
                    user.avatar.public_id = myCloud.public_id;
                }

            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            user,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


export const updateRole = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { userId } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found!", 404));
        }

        user.role = "admin"

        await user.save();

        res.status(200).json({
            success: true,
            message: "User Role Changed!"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllUsers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const users = await userModel.find({});

        if (!users) {
            return next(new ErrorHandler("No Users found!", 404));
        }

        res.status(200).json({
            success: true,
            users,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const updateUserRole = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const users = await userModel.find({});

        if (!users) {
            return next(new ErrorHandler("No Users found!", 404));
        }

        res.status(200).json({
            success: true,
            users,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});