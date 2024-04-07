import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { CourseModel, ICourse } from "../models/courseModel";
import cloudinary from "../utils/cloudinary";
import { getDataUri } from "../utils/dataUri";

// Create an course
export const createCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // File upload needs to be fixed
        const {
            name,
            description,
            categories,
            price,
            estimatedPrice,
            tags,
            benefits,
            prerequisites
        } = req.body;

        const thumbnail: any = req.body.thumbnail;

        if (!name || !description || !categories || !price || !estimatedPrice || !thumbnail || !tags || !benefits || !prerequisites) {
            return next(new ErrorHandler("Please enter all fields!", 400));
        }

        // const fileUri = await getDataUri(thumbnail);

        const result = await cloudinary.uploader.upload(thumbnail || '', {
            folder: 'courseThumbnail'
        })

        const course = await CourseModel.create({
            userId: req.user?._id,
            name,
            description,
            categories,
            price,
            estimatedPrice,
            thumbnail: {
                public_id: result.public_id,
                url: result.secure_url
            },
            tags,
            benefits: benefits,
            prerequisites: prerequisites
        });

        res.status(200).json({
            success: true,
            message: "Course created successfully!",
            course,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Update Course Detail
export const updateCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const {
            name,
            description,
            categories,
            price,
            estimatedPrice,
            tags,
        } = req.body;

        const thumbnail = req.file as any;

        const course = await CourseModel.findById(req.params.id);

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        const updatedCourse = await course?.updateOne({
            name: name ? name : course.name,
            description: description ? description : course.description,
            categories: categories ? categories : course.categories,
            price: price ? price : course.price,
            estimatedPrice: estimatedPrice ? estimatedPrice : course.estimatedPrice,
            tags: tags ? tags : course.tags,
            // thumbnail: thumbnail ? thumbnail : course.thumbnail,
        });

        await course?.save();

        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            updatedCourse,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Delete Course
export const deleteCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const course = await CourseModel.findById(req.params.id);

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        await cloudinary.uploader.destroy(course.thumbnail.public_id || '');

        await course.deleteOne();

        res.status(200).json({
            success: true,
            message: "Course deleted successfully!",
            course,
        });


    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get single course
export const getCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const course = await CourseModel.findById(req.params.id as string).select("-courseData.links.url");

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        res.status(200).json({
            success: true,
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Find multiple courses
export const getCourses = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { course_name } = req.query;

        const query: any = {};

        if (course_name) {
            query['name'] = {
                $regex: course_name.toString(),
                $options: 'i',
            }
        }

        const courses = await CourseModel.find(query).select("-courseData.links -reviews -benefits -prerequisites");

        if (!courses) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        res.status(200).json({
            success: true,
            courses,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Add course data in a perticular course
export const addCourseData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;

        const data = req.body;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        const courseData = await course.courseData.push(data);

        await course?.save();

        res.status(200).json({
            success: true,
            message: "Course data added successfully!",
            courseData
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Delete course data in a perticular course
export const deleteCourseData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        const courseDataId = req.body.id;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        const courseDataIndex = await course.courseData.findIndex(course => course._id.toString() === courseDataId);

        if (courseDataIndex === -1) {
            return next(new ErrorHandler("CourseData not found!", 400));
        }

        const deletedCourseData = course.courseData.splice(courseDataIndex, 1);

        await course.save();

        res.status(200).json({
            success: true,
            deletedCourseData
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Not tested need to tested some complex issues need to analyzed or fixeds
// Updates course data in a perticular course
export const updateCourseData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        const courseDataId = req.body.id;
        const data = req.body;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        const courseDataIndex = await course.courseData.findIndex(course => course._id.toString() === courseDataId);

        if (courseDataIndex === -1) {
            return next(new ErrorHandler("CourseData not found!", 400));
        }

        course.courseData[courseDataIndex] = { ...course.courseData[courseDataIndex], ...data };

        await course.save();

        res.status(200).json({
            success: true,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Show all admin courses
export const getAdminCourses = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const courses = await CourseModel.find({ userId: req.user?._id });

        if (!courses) {
            return next(new ErrorHandler("You do not have any courses available!", 404));
        }

        res.status(200).json({
            success: true,
            courses,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Add review to a course
export const addReviewToCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { rating, comment } = req.body;
        const userId = req.user?._id as string;
        // Temporary its body then will shift to the params for the course
        const course = await CourseModel.findById(req.body.id);

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        const review: any = {
            userId: userId,
            rating: rating ? rating : 0,
            comment: comment ? comment : 0,
        }

        course.reviews.push(review);

        let avg = 0;
        course?.reviews.forEach((rev: any) => {
            avg += rev.rating;
        });

        if (course) {
            course.ratings = avg / course.reviews.length;
        }

        await course?.save();

        res.status(200).json({
            success: true,
            message: "Review added successfully!",
            course,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Add Reply to Review on a perticular course
export const addReplyToReview = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { comment } = req.body;
        const { courseId, reviewId } = req.body;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        const courseReviewIndex = await course.reviews.findIndex((rev) => rev._id.toString() === reviewId.toString());

        if (courseReviewIndex < 0) {
            return next(new ErrorHandler("Review not found", 404));
        }

        if (course.reviews && course.reviews[courseReviewIndex]) {
            course.reviews[courseReviewIndex].commentReplies = comment;
        }

        await course?.save();

        res.status(200).json({
            success: true,
            message: "Reply added successfully!",
            course,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Add Question to an Course Data
export const addQueToCourseData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    try {

        const courseId = req.params.id;
        const { question, courseDataId } = req.body;
        const userId = req.user?._id;


        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        const courseDataIndex = await course.courseData.findIndex((course) => course._id.toString() === courseDataId);

        if (courseDataIndex < 0) {
            return next(new ErrorHandler("Course Data not found!", 404));
        }

        const questions: any = {
            userId: userId,
            question: question,
        }

        course.courseData[courseDataIndex].questions.push(questions);

        await course?.save();

        res.status(200).json({
            success: true,
            message: "Question added successfully!"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }

});

// Add Question reply to an courseData
export const addQueReplyToCourseData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    try {

        const courseId = req.params.id;
        const { answer, courseDataId, questionId } = req.body;
        const userId = req.user?._id;

        if (!answer) {
            return next(new ErrorHandler("Fill the answer field!", 400));
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        const courseDataIndex = await course.courseData.findIndex((course) => course._id.toString() === courseDataId);

        if (courseDataIndex < 0) {
            return next(new ErrorHandler("Course Data not found!", 404));
        }

        const answerData: any = {
            userId: userId,
            answer: answer,
        }

        const questionIndex = await course.courseData[courseDataIndex].questions.findIndex((que) => que._id.toString() === questionId);

        if (questionIndex < 0) {
            return next(new ErrorHandler("Question not found!", 404));
        }

        course.courseData[courseDataIndex].questions[questionIndex].questionReplies?.push(answerData);

        await course?.save();

        res.status(200).json({
            success: true,
            message: "Question reply added successfully!"
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }

});

