// src/utils/errorHandler.ts

// Custom error class with status code
export class AppError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      
      // Maintain proper stack trace for where our error was thrown
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Not found error
  export const notFoundError = (resource: string): AppError => {
    return new AppError(`${resource} not found`, 404);
  };
  
  // Bad request error
  export const badRequestError = (message: string): AppError => {
    return new AppError(message, 400);
  };
  
  // Unauthorized error
  export const unauthorizedError = (message: string = 'Unauthorized'): AppError => {
    return new AppError(message, 401);
  };
  
  // Server error
  export const serverError = (message: string = 'Internal server error'): AppError => {
    return new AppError(message, 500);
  };
  
  // Async error handler to catch errors in async functions
  export const asyncHandler = (fn: Function) => {
    return (req: any, res: any, next: any) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };