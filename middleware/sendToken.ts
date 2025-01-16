import { Response } from "express";
import { IUser, userModel } from "../models/userModel";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

const sendToken = async (
    res: Response,
    user: IUser,
    message: string,
    statusCode: number = 200
): Promise<void> => {
    // const token: string = generateToken(user._id);
    const accessToken = generateAccessToken({ _id: user._id });
    const refreshToken = generateRefreshToken({ _id: user._id });

    await userModel.findByIdAndUpdate(
        user._id,
        {
            $set: { refreshToken: refreshToken },
        },
        { new: true }
    );


    res.status(statusCode)
        .cookie('access_token', accessToken, {
            expires: new Date(Date.now() + 5 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }).cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        })
        .json({
            success: true,
            message,
            data: {
                accessToken,
                refreshToken,
            }
        });
}

export default sendToken;     