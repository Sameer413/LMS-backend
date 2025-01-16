import mongoose, { Document, Model, Schema } from "mongoose";

const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document {
    _id: string;
    refreshToken?: string;
    username: string;
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id?: string;
        url?: string;
    },
    role: string;
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        // required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: {
            validator: function (value: string) {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email",
        },
        unique: true,
    },
    password: {
        type: String,
        // required: [true, "Please enter your password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user",
    },
    courses: [
        {
            courseId: String,
        }
    ],
    refreshToken: {
        type: String
    }
}, {
    timestamps: true,
});

export const userModel: Model<IUser> = mongoose.model("User", userSchema);