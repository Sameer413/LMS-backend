import express, { NextFunction, Request, Response, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/indexRoutes';
import { errorMiddleware } from './middleware/error';
import cors from 'cors';
export const app = express();

// body parser
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({
    extended: true
}));

app.use(cors({
    origin: ['http://localhost:3000', '*'],
    credentials: true,
}));

app.use('/api/v1', router);


app.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Wrong route..."
    })
    const error = new Error(`Route ${req.originalUrl} not found`) as any;
    error.statusCode = 404;
    next(error);
});

app.use(errorMiddleware);