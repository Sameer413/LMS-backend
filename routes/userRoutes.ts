import express from 'express';
import { updatePassword, userDetail, deleteUser, updateProfile, getAllUsers } from '../controllers/userController';
import { uploadImageMulter } from '../middleware/multer';
import { isAuthenticated } from '../middleware/auth';

const userRouter = express.Router();

userRouter.get('/me', isAuthenticated, userDetail);

userRouter.delete('/user-delete', deleteUser);

userRouter.put('/update-password', isAuthenticated, updatePassword);


userRouter.put('/update-user', isAuthenticated, uploadImageMulter.single('image'), updateProfile)

userRouter.get('/users-all', getAllUsers);

userRouter.put('/user-role-update')

export default userRouter;