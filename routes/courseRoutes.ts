import express from 'express';
import { createCourse, updateCourse, deleteCourse, getCourse, getCourses, addCourseData, deleteCourseData, updateCourseData, getAdminCourses, addReviewToCourse, addReplyToReview, addQueToCourseData, addQueReplyToCourseData } from '../controllers/courseController';
import { isAuthenticated } from '../middleware/auth';
import multerUploads from '../middleware/multer';

const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, createCourse);

courseRouter.put('/update-course/:id', updateCourse);

courseRouter.delete('/delete-course/:id', deleteCourse);

courseRouter.get('/course/:id', getCourse);

courseRouter.get('/courses', getCourses);

courseRouter.post('/course/add-data/:id', addCourseData);

courseRouter.delete('/course/delete-data/:id', deleteCourseData);

courseRouter.put('/course/update-data/:id', updateCourseData);

courseRouter.get('/admin-courses', isAuthenticated, getAdminCourses);

courseRouter.post('/add-review', isAuthenticated, addReviewToCourse);

courseRouter.post('/add-review-reply', isAuthenticated, addReplyToReview);

courseRouter.post('/add-que-course-data/:id', isAuthenticated, addQueToCourseData);

courseRouter.post('/add-que-reply-course-data/:id', isAuthenticated, addQueReplyToCourseData);
// Roles need to be admin moderator and the user
export default courseRouter;