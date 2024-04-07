import { NextFunction, Request, Response } from "express";

const catchAsyncError = (fun: (req: Request, res: Response, next: NextFunction) => any) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Promise
        .resolve(fun(req, res, next))
        .catch(next);
}

export default catchAsyncError;