import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { CourseModel, ICourse } from "../models/courseModel";
import { deleteFile, generateFileName, storage, uploadFile } from "../utils/supabase";
import fs from 'fs'

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

        const thumbnail = req.file;

        const parsedBenefits = Array.isArray(benefits) ? benefits : JSON.parse(benefits)
        const parsedPrerequisites = Array.isArray(prerequisites) ? benefits : JSON.parse(prerequisites)

        if (!name || !description || !categories || !price || !estimatedPrice || !thumbnail || !tags || !benefits || !prerequisites) {
            return next(new ErrorHandler("Please enter all fields!", 400));
        }

        const thumbnailBuffer = fs.readFileSync(thumbnail?.path!)

        const { success, error, url, path } = await uploadFile({
            bucket: 'thumbnails',
            // fileName: `${thumbnail?.filename.split('.')[0]}-${name.replace(/\s+/g, '_').toLowerCase()}.${thumbnail?.filename.split('.').pop()}`,\
            fileName: generateFileName(thumbnail?.filename, name),
            file: thumbnailBuffer,
            mimeType: thumbnail?.mimetype!
        })

        fs.unlinkSync(thumbnail?.path!)

        if (error) {
            return next(new ErrorHandler('Failed while uploading a file', 400))
        }

        const course = await CourseModel.create({
            userId: req.user?._id,
            name,
            description,
            categories,
            price,
            estimatedPrice,
            thumbnail: {
                path: path,
                url: url
            },
            tags,
            benefits: { ...parsedBenefits },
            prerequisites: { ...parsedPrerequisites }
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

        const { data } = await deleteFile({ bucket: 'thumbnails', publicUrl: course.thumbnail.url });

        if (!data) {
            return next(new ErrorHandler("Error while deleting the data from the storage", 400));
        }

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

        const courseId = req.params.id as string;

        if (!courseId) {
            return next(new ErrorHandler("id not provided in params", 404));
        }

        const course: ICourse = await CourseModel.findById(req.params.id as string).select("-courseData.links.url -userId -thumbnail.path");

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
        // Filtering using some of the additional queries
        const { course_name, categories } = req.query;

        const query: any = {};

        if (course_name) {
            query['name'] = {
                $regex: course_name.toString(),
                $options: 'i',
            }
        }
        // if(categories){
        //     query['categories'] = {

        //     }
        // }

        const courses = await CourseModel.find(query).select("-courseData -reviews -benefits -prerequisites -demoUrl");

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

// // Add Question to an Course Data
// export const addQueToCourseData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

//     try {

//         const courseId = req.params.id;
//         const { question, courseDataId } = req.body;
//         const userId = req.user?._id;


//         const course = await CourseModel.findById(courseId);

//         if (!course) {
//             return next(new ErrorHandler("Course not found!", 404));
//         }

//         const courseDataIndex = await course.courseData.findIndex((course) => course._id.toString() === courseDataId);

//         if (courseDataIndex < 0) {
//             return next(new ErrorHandler("Course Data not found!", 404));
//         }

//         const questions: any = {
//             userId: userId,
//             question: question,
//         }

//         course.courseData[courseDataIndex].questions.push(questions);

//         await course?.save();

//         res.status(200).json({
//             success: true,
//             message: "Question added successfully!"
//         });

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }

// });

// // Add Question reply to an courseData
// export const addQueReplyToCourseData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

//     try {

//         const courseId = req.params.id;
//         const { answer, courseDataId, questionId } = req.body;
//         const userId = req.user?._id;

//         if (!answer) {
//             return next(new ErrorHandler("Fill the answer field!", 400));
//         }

//         const course = await CourseModel.findById(courseId);

//         if (!course) {
//             return next(new ErrorHandler("Course not found!", 404));
//         }

//         const courseDataIndex = await course.courseData.findIndex((course) => course._id.toString() === courseDataId);

//         if (courseDataIndex < 0) {
//             return next(new ErrorHandler("Course Data not found!", 404));
//         }

//         const answerData: any = {
//             userId: userId,
//             answer: answer,
//         }

//         const questionIndex = await course.courseData[courseDataIndex].questions.findIndex((que) => que._id.toString() === questionId);

//         if (questionIndex < 0) {
//             return next(new ErrorHandler("Question not found!", 404));
//         }

//         course.courseData[courseDataIndex].questions[questionIndex].questionReplies?.push(answerData);

//         await course?.save();

//         res.status(200).json({
//             success: true,
//             message: "Question reply added successfully!"
//         });

//     } catch (error: any) {
//         return next(new ErrorHandler(error.message, 500));
//     }

// });

