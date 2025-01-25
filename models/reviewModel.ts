import { Schema, Document } from "mongoose";

export interface IReview extends Document {
    userId: string;
    rating: number;
    comment: string;
    commentReplies: string;
}

const reviewSchema = new Schema<IReview>({
    userId: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
    commentReplies: { type: String, default: "" },
});

export { reviewSchema };