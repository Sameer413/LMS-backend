import { Schema, Document } from "mongoose";

export interface ILink extends Document {
    title: string;
    url: string;
}

const linkSchema = new Schema<ILink>({
    title: { type: String, required: true },
    url: { type: String, required: true },
});

export { linkSchema };