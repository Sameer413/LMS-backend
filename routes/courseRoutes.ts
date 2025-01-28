import express from 'express';
import { createCourse, updateCourse, deleteCourse, getCourse, getCourses, getAdminCourses, addReviewToCourse, addReplyToReview, addQueToCourseData, addQueReplyToCourseData } from '../controllers/courseController';
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

courseRouter.post('/add-review/:courseId', isAuthenticated, addReviewToCourse); // done

courseRouter.post('/add-review-reply/:courseId', isAuthenticated, addReplyToReview); // done

courseRouter.post('/add-que-course-data/:courseDataId', isAuthenticated, addQueToCourseData); // done

courseRouter.post('/add-que-reply-course-data/:courseDataId', isAuthenticated, addQueReplyToCourseData); // done

// later feature like delete update que/replies etc.
// Roles need to be admin moderator and the user
export default courseRouter;