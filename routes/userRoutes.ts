import express from 'express';
import { updatePassword, userDetail, deleteUser, updateProfile, getAllUsers } from '../controllers/userController';
import { isAuthenticated } from '../middleware/auth';
import multerUploads from '../middleware/multer';

const userRouter = express.Router();


userRouter.delete('/user-delete', deleteUser);

userRouter.put('/update-password', isAuthenticated, updatePassword);

userRouter.get('/user-me', isAuthenticated, userDetail);

userRouter.put('/update-user', isAuthenticated, multerUploads.single('image'), updateProfile)

userRouter.get('/users-all', isAuthenticated, getAllUsers);

export default userRouter;