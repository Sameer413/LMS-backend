import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
    courseId: string;
    userId: string;
    payment_info: object;
    isVerified: boolean;
}

const OrderSchema = new Schema<IOrder>({
    courseId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    payment_info: {
        type: Object,
    }
}, {
    timestamps: true
});

export const OrderModel: Model<IOrder> = mongoose.model('Order', OrderSchema);