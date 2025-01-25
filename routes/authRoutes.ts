import express from 'express';

import { refreshToken, signIn, signOut, signUp } from '../controllers/authController';


const authRouter = express.Router();

authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

authRouter.get('/sign-out', signOut);

authRouter.get('/refresh-token', refreshToken);

export default authRouter;