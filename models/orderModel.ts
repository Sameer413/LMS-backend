import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrder extends Document {
    payId: string;
    courseId: string;
    userId: string;
    // payment_info: object;
    isVerified: boolean;
    paymentId: string,
    receipt: string,
    amount: number,
    currency: string,
    status: string,
    paymentMethod: string,

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
    payId: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    paymentId: {
        type: String, // Razorpay payment_id
        default: null, // Filled after payment completion
    },
    receipt: {
        type: String, // Receipt generated during order creation
        required: true,
    },
    amount: {
        type: Number, // Total order amount
        required: true,
    },
    currency: {
        type: String, // Currency used, e.g., INR
        required: true,
        default: 'INR',
    },
    status: {
        type: String, // Payment status (e.g., 'created', 'captured', 'failed')
        required: true,
        default: 'created',
    },
    paymentMethod: {
        type: String, // Method of payment (card, UPI, etc.)
        default: null,
    },
}, {
    timestamps: true,
});

export const OrderModel: Model<IOrder> = mongoose.model('Order', OrderSchema);