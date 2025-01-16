import jwt, { JwtPayload, Secret } from "jsonwebtoken";


const ACCESS_TOKEN_SECRET: Secret =
    process.env.ACCESS_TOKEN_SECRET || "ACCESSTHETOKEN";
const REFRESH_TOKEN_SECRET: Secret =
    process.env.REFRESH_TOKEN_SECRET || "REFRESHTHETOKEN";

interface PayLoadType {
    _id: string;
}

export const generateAccessToken = (user: PayLoadType) => {
    return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "2m" });
};

export const generateRefreshToken = (user: PayLoadType) => {
    return jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

// export const refreshToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
//     const refresh_token = req.cookies.refresh_token || req.body.refresh_token;

//     if (!refresh_token) {
//         return next(new ErrorHandler("Unauthorized request", 401));
//     }

//     try {
//         const decoded = jwt.verify(
//             refresh_token,
//             process.env.REFRESH_TOKEN_SECRET!
//         ) as JwtPayload;

//         // Ensure decoded payload contains the correct id property
//         const userId = decoded.userId;

//         if (!userId) {
//             return next(new ErrorHandler("Invalid token", 401));
//         }

//         const user = await userModel.findById(userId);

//         if (!user) {
//             return next(
//                 new ErrorHandler("Please log in to access this resource", 400)
//             );
//         }

//         // Generate new access and refresh tokens
//         const accessToken = generateAccessToken({ email: user.email, userId: user._id as string });
//         const newRefreshToken = generateRefreshToken({ email: user.email, userId: user._id as string });

//         await user.updateOne({
//             refresh_token: newRefreshToken,
//         });

//         // Set cookies with new tokens
//         res.cookie("access_token", accessToken, {
//             httpOnly: true,
//             sameSite: "strict",
//             maxAge: 5 * 60 * 60 * 1000
//         });
//         res.cookie("refresh_token", newRefreshToken, {
//             httpOnly: true,
//             sameSite: "strict",
//             maxAge: 2 * 24 * 60 * 60 * 1000
//         });

//         // Send response with new tokens
//         res.status(200).json({
//             success: true,
//             accessToken,
//             refreshToken: newRefreshToken,
//         });
//     } catch (error: any) {
//         return next(
//             new ErrorHandler("Token verification failed. Please log in again.", 401)
//         );
//     }
// })