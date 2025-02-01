import mongoose, { Schema, Document, Model } from "mongoose";
import { courseDataSchema } from "./courseDataModel";
import { reviewSchema, IReview } from "./reviewModel";

export interface ICourse extends Document {
    userId: string;
    name: string;
    description?: string;
    categories: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: {
        path: string;
        url: string;
    };
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: mongoose.Types.ObjectId[]; // Reference to `CourseData`
    ratings?: number;
    purchased?: number;
}

const courseSchema = new Schema<ICourse>(
    {
        userId: { type: String, ref: "User", required: true },
        name: { type: String, required: true },
        description: { type: String },
        categories: { type: String, required: true },
        price: { type: Number, required: true },
        estimatedPrice: { type: Number },
        thumbnail: {
            path: { type: String },
            url: { type: String },
        },
        tags: { type: String },
        level: { type: String, required: true },
        demoUrl: { type: String },
        benefits: [{ title: String }],
        prerequisites: [{ title: String }],
        reviews: [reviewSchema],
        courseData: [{ type: Schema.Types.ObjectId, ref: "CourseData" }], // Reference to CourseData
        ratings: { type: Number, default: 0 },
        purchased: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);
