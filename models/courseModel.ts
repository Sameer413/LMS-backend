import mongoose, { Document, Model, Schema } from "mongoose";

interface IComment extends Document {
    userId: String;
    question: string;
    questionReplies?: IComment[]
}

interface IReview extends Document {
    userId: string,
    rating: number,
    comment: string,
    commentReplies: string,
}

interface ILink extends Document {
    title: string,
    url: string,
}

interface ICourseData extends Document {
    videoUrl: String,
    videoThumbnail: Object,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,  // Uncommented
    links: [ILink],
    suggestion: String,
    questions: [IComment],
}

export interface ICourse extends Document {
    userId: Schema.Types.ObjectId;
    name: string;
    description?: string;
    categories: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: {
        public_id: string;
        url: string;
    };
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
}

const reviewSchema = new Schema<IReview>({
    userId: {
        type: String,
        ref: "User",
    },
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: String,
});

const linkSchema = new Schema<ILink>({
    title: String,
    url: String,
});

const commentSchema = new Schema<IComment>({
    userId: String,
    question: String,
    questionReplies: [Object],
});

const courseDataSchema = new Schema<ICourseData>({
    // videoUrl: String,
    // videoThumbnail: Object,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    // videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>({
    userId: {
        type: String,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categories: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            type: String
        },
        url: {
            type: String,
        }
    },
    tags: {
        type: String,
        required: true,
    },
    demoUrl: {
        type: String,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true
});

export const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);