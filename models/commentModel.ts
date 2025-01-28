import { Types } from "mongoose";
import { Schema, Document } from "mongoose";

export interface IComment extends Document {
    userId: string;
    question: string;
    questionReplies?: Types.DocumentArray<IComment>;
}

const commentSchema = new Schema<IComment>({
    userId: { type: String, required: true },
    question: { type: String, required: true },
    questionReplies: [{ type: Schema.Types.Mixed }],
});

export { commentSchema };