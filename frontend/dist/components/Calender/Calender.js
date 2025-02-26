"use strict";
// src/components/Calender/Calender.tsx
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const TaskContext_1 = require("../../context/TaskContext");
require("./Calender.css");
const Calendar = () => {
    const [currentDate, setCurrentDate] = (0, react_1.useState)(new Date());
    const { tasks } = (0, TaskContext_1.useTaskContext)();
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };
    const formatMonth = (date) => {
        return date.toLocaleString('default', { month: 'short' });
    };
    const prevMonth = () => {
        setCurrentDate(prevDate => {
            const date = new Date(prevDate);
            date.setMonth(date.getMonth() - 1);
            return date;
        });
    };
    const nextMonth = () => {
        setCurrentDate(prevDate => {
            const date = new Date(prevDate);
            date.setMonth(date.getMonth() + 1);
            return date;
        });
    };
    const isToday = (year, month, day) => {
        const today = new Date();
        return (day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear());
    };
    // Check if a day has any tasks with deadlines on that date
    const hasTasks = (year, month, day) => {
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0); // Set to start of day
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1); // Set to start of next day
        return tasks.some(task => {
            if (!task.deadline)
                return false;
            const taskDate = new Date(task.deadline);
            taskDate.setHours(0, 0, 0, 0); // Set to start of day
            return taskDate.getTime() === date.getTime();
        });
    };
    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);
        // Array of weekday abbreviations
        const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        // Create array for calendar days
        const calendarDays = [];
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isCurrentDay = isToday(year, month, day);
            const hasTask = hasTasks(year, month, day);
            calendarDays.push(<div key={day} className={`calendar-day ${isCurrentDay ? 'today' : ''} ${hasTask ? 'has-task' : ''}`}>
          {day}
        </div>);
        }
        return (<div className="calendar">
        <div className="calendar-header">
          <button className="calendar-nav" onClick={prevMonth}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="calendar-title">
            {formatMonth(currentDate)} {currentDate.getFullYear()}
          </div>
          <button className="calendar-nav" onClick={nextMonth}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="calendar-weekdays">
          {weekdays.map((day) => (<div key={day} className="weekday">{day}</div>))}
        </div>
        
        <div className="calendar-days">
          {calendarDays}
        </div>
      </div>);
    };
    return renderCalendar();
};
exports.default = Calendar;
