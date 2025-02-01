import express from 'express';
import { createCourse, updateCourse, deleteCourse, getCourse, getCourses, addReviewToCourse, addReplyToReview, addQueToCourseData, addQueReplyToCourseData, getAllAdminCourses } from '../controllers/courseController';
import { isAuthenticated } from '../middleware/auth';
import { uploadImageMulter } from '../middleware/multer';
// import { refreshToken } from '../controllers/authController';    

const courseRouter = express.Router();

courseRouter.post('/create-course', isAuthenticated, createCourse); // done

courseRouter.put('/update-course/:id', updateCourse);

courseRouter.delete('/delete-course/:id', isAuthenticated, deleteCourse); // done

courseRouter.get('/course/:id', getCourse); // done

courseRouter.get('/courses', getCourses);

// courseRouter.get('/admin-courses', isAuthenticated, getAdminCourses);

courseRouter.post('/add-review/:courseId', isAuthenticated, addReviewToCourse); // done

courseRouter.post('/add-review-reply/:courseId', isAuthenticated, addReplyToReview); // done

courseRouter.post('/add-que-course-data/:courseDataId', isAuthenticated, addQueToCourseData); // done

courseRouter.post('/add-que-reply-course-data/:courseDataId', isAuthenticated, addQueReplyToCourseData); // done

courseRouter.get('/admin-courses', isAuthenticated, getAllAdminCourses); // done
// later feature like delete update que/replies etc.
// Roles need to be admin moderator and the user
export default courseRouter;