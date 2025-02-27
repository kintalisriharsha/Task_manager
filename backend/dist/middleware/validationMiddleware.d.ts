import { Request, Response, NextFunction } from 'express';
export declare const validateTaskCreation: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateTaskUpdate: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateIdParam: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateTaskIdQuery: (req: Request, res: Response, next: NextFunction) => void;
