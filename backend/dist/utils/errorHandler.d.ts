export declare class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare const notFoundError: (resource: string) => AppError;
export declare const badRequestError: (message: string) => AppError;
export declare const unauthorizedError: (message?: string) => AppError;
export declare const serverError: (message?: string) => AppError;
export declare const asyncHandler: (fn: Function) => (req: any, res: any, next: any) => void;
