import { Router } from "express";
import { addCourseData, deleteCourseData, getCourseData, getCourseDataByCourseId, updateCourseData, } from "../controllers/courseDataController";
import { uploadImageMulter } from "../middleware/multer";

const courseDataRouter = Router();

courseDataRouter.get('/course/retrieve-all-data/:courseId', getCourseDataByCourseId);

courseDataRouter.get('/course/retrieve-data/:courseDataId', getCourseData);

courseDataRouter.post('/course/add-data/:id', uploadImageMulter.single("videoThumbnail"), addCourseData); //done some things need to be done from client side (video related)

courseDataRouter.delete('/course/delete-data/:id', deleteCourseData); // done

// courseDataRouter.put('/course/update-data/:id', updateCourseData);


export default courseDataRouter