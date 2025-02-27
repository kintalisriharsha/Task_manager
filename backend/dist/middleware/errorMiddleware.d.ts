import { Request, Response, NextFunction } from 'express';
interface AppError extends Error {
    statusCode?: number;
}
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: AppError, _req: Request, res: Response, _next: NextFunction) => void;
export {};
