import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { CourseModel } from "../models/courseModel";
import { CourseDataModel } from "../models/courseDataModel";
import { deleteFile, generateFileName, uploadFile } from "../utils/supabase";
import fs from 'fs'

export const getCourseData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseDataId } = req.params;

        const courseData = await CourseDataModel.findById(courseDataId);

        if (!courseData) {
            return next(new ErrorHandler('Course data not found', 404));
        }

        return res.status(200).json({
            success: true,
            data: {
                courseData
            }
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

export const getCourseDataByCourseId = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;

        const courseData = await CourseDataModel.find({
            courseId: courseId
        });

        if (!courseData) {
            return next(new ErrorHandler('Course data not found', 404));
        }

        return res.status(200).json({
            success: true,
            data: {
                courseData
            }
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Add course data in a perticular course
export const addCourseData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;

        const {
            title,
            description,
            // Take all this from the client side reducing server cost
            videoUrl,
            videoSection,
            videoLength,
            links,
            suggestion,
            questions,
        } = req.body;

        const videoThumbnail = req.file;

        const videoThumbnailBuffer = fs.readFileSync(videoThumbnail?.path!)


        const { error, url, path } = await uploadFile({
            bucket: 'thumbnails',
            // fileName: `${videoThumbnail?.filename.split('.')[0]}-${title
            //     .replace(/\s+/g, '_')
            //     .toLowerCase()
            //     }.${videoThumbnail?.filename.split('.').pop()}`,
            fileName: generateFileName(videoThumbnail!.filename, title),
            file: videoThumbnailBuffer,
            mimeType: videoThumbnail?.mimetype!
        });

        fs.unlinkSync(videoThumbnail?.path!)

        if (error) {
            return next(new ErrorHandler('Failed while uploading a file', 400))
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found!", 404));
        }

        const courseData = await CourseDataModel.create({
            courseId: courseId,
            title: title,
            description: description,
            videoThumbnail: {
                url: url,
                path: path,
            },
            videoSection: videoSection || '',
            videoLength: videoLength,
            videoUrl: videoUrl,
            links: [{
                title: "tutul",
                url: "url"
            }],
            suggestion: ""
        });

        course.courseData.push(courseData._id);

        await course?.save();

        res.status(200).json({
            success: true,
            message: "Course data added successfully!",
            // courseData
            data: {
                course
            }
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// Delete course data in a perticular course
export const deleteCourseData = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseId = req.params.id;
        const { courseDataId } = req.body;

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler('Course not found', 404));
        }

        const courseData = await CourseDataModel.findById(courseDataId);

        const { data } = await deleteFile({
            bucket: 'thumbnails',
            publicUrl: courseData?.videoThumbnail.url!
        });

        if (!data) {
            return next(new ErrorHandler("Error while deleting the data from the storage", 400));
        }

        // Remove the courseData reference from the course
        course.courseData = course.courseData.filter(
            (dataId) => dataId.toString() !== courseDataId
        );

        await course.save();
        await courseData?.deleteOne();

        res.status(200).json({
            success: true,
            message: "Course Data deleted"
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