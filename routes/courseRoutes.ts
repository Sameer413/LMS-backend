import express from 'express';
import { createCourse, updateCourse, deleteCourse, getCourse, getCourses, getAdminCourses, addReviewToCourse, addReplyToReview } from '../controllers/courseController';
import { isAuthenticated } from '../middleware/auth';
import { uploadImageMulter } from '../middleware/multer';
import { refreshToken } from '../controllers/authController';

const courseRouter = express.Router();

courseRouter.post('/create-course', refreshToken, isAuthenticated, uploadImageMulter.single("thumbnail"), createCourse); // done

courseRouter.put('/update-course/:id', updateCourse);

courseRouter.delete('/delete-course/:id', deleteCourse); // done

courseRouter.get('/course/:id', getCourse); // done

courseRouter.get('/courses', getCourses);

courseRouter.get('/admin-courses', isAuthenticated, getAdminCourses);

courseRouter.post('/add-review', isAuthenticated, addReviewToCourse);

courseRouter.post('/add-review-reply', isAuthenticated, addReplyToReview);

// courseRouter.post('/add-que-course-data/:id', isAuthenticated, addQueToCourseData);

// courseRouter.post('/add-que-reply-course-data/:id', isAuthenticated, addQueReplyToCourseData);
// Roles need to be admin moderator and the user
export default courseRouter;