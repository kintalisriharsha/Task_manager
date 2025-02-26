"use strict";
// src/utils/dateUtils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateInFuture = exports.isToday = exports.getTimeLeft = exports.formatDateTime = exports.formatDate = void 0;
/**
 * Formats a date to a readable format (e.g., "Jan 1, 2023")
 */
const formatDate = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
exports.formatDate = formatDate;
/**
 * Formats a date to include time (e.g., "Jan 1, 2023, 12:00 PM")
 */
const formatDateTime = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
};
exports.formatDateTime = formatDateTime;
/**
 * Calculates time left until a deadline
 */
const getTimeLeft = (deadline) => {
    const deadlineDate = deadline instanceof Date ? deadline : new Date(deadline);
    const now = new Date();
    // If deadline has passed
    if (deadlineDate < now) {
        return 'Overdue';
    }
    const timeLeft = deadlineDate.getTime() - now.getTime();
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) {
        return `${days}d ${hours}h left`;
    }
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
        return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
};
exports.getTimeLeft = getTimeLeft;
/**
 * Checks if a date is today
 */
const isToday = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const today = new Date();
    return (dateObj.getDate() === today.getDate() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getFullYear() === today.getFullYear());
};
exports.isToday = isToday;
/**
 * Get a date that is X days from now
 */
const getDateInFuture = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};
exports.getDateInFuture = getDateInFuture;
