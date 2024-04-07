import { Schema, model } from "mongoose";

interface Category extends Document {
    title: string;
}

interface FaqItem extends Document {
    questions: string;
    answer: string;
}

const categorySchema = new Schema<Category>({
    title: { type: String, }
});

const faqSchema = new Schema<FaqItem>({
    questions: { type: String },
    answer: { type: String },
});

interface Layout extends Document {
    faq: FaqItem[];
    categories: Category[];
}

const layoutSchema = new Schema<Layout>({
    faq: [faqSchema],
    categories: [categorySchema],
});

export const LayoutModel = model<Layout>('Layout', layoutSchema);