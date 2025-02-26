"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_TIMEOUT = 15000; // 15 seconds
class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
const fetchWithTimeout = (url, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const { timeout = API_TIMEOUT } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = yield fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
        clearTimeout(id);
        if (!response.ok) {
            const error = yield response.json().catch(() => ({}));
            throw new ApiError(error.message || 'An error occurred', response.status);
        }
        return response.json();
    }
    catch (error) {
        clearTimeout(id);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError('Request timeout', 408);
        }
        throw error;
    }
});
const api = {
    get: (endpoint, options) => {
        return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, Object.assign(Object.assign({}, options), { method: 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers) }));
    },
    post: (endpoint, data, options) => {
        return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, Object.assign(Object.assign({}, options), { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers), body: JSON.stringify(data) }));
    },
    put: (endpoint, data, options) => {
        return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, Object.assign(Object.assign({}, options), { method: 'PUT', headers: Object.assign({ 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers), body: JSON.stringify(data) }));
    },
    delete: (endpoint, options) => {
        return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, Object.assign(Object.assign({}, options), { method: 'DELETE', headers: Object.assign({ 'Content-Type': 'application/json' }, options === null || options === void 0 ? void 0 : options.headers) }));
    },
};
exports.default = api;
