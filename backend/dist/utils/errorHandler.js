"use strict";
// src/utils/errorHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.serverError = exports.unauthorizedError = exports.badRequestError = exports.notFoundError = exports.AppError = void 0;
// Custom error class with status code
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Maintain proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Not found error
const notFoundError = (resource) => {
    return new AppError(`${resource} not found`, 404);
};
exports.notFoundError = notFoundError;
// Bad request error
const badRequestError = (message) => {
    return new AppError(message, 400);
};
exports.badRequestError = badRequestError;
// Unauthorized error
const unauthorizedError = (message = 'Unauthorized') => {
    return new AppError(message, 401);
};
exports.unauthorizedError = unauthorizedError;
// Server error
const serverError = (message = 'Internal server error') => {
    return new AppError(message, 500);
};
exports.serverError = serverError;
// Async error handler to catch errors in async functions
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map