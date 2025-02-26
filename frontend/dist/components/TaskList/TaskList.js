"use strict";
// src/components/TaskList/TaskList.tsx
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const TaskContext_1 = require("../../context/TaskContext");
const TaskItem_1 = __importDefault(require("../TaskItem"));
require("./TaskList.css");
const TaskList = ({ onTaskSelect }) => {
    const { selectedCategory, getTasksByCategory, isLoading, error, searchTerm, filterOptions } = (0, TaskContext_1.useTaskContext)();
    const tasks = getTasksByCategory(selectedCategory);
    const hasActiveFilters = searchTerm.trim() !== '' ||
        filterOptions.status !== 'all' ||
        filterOptions.deadline !== 'all' ||
        filterOptions.duration !== 'all';
    if (isLoading) {
        return (<div className="task-list-loader">
        <div className="loader-spinner"></div>
        <p>Loading tasks...</p>
      </div>);
    }
    if (error) {
        return (<div className="task-list-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>);
    }
    if (tasks.length === 0) {
        return (<div className="task-list-empty">
        <div className="empty-illustration">
          <i className="far fa-clipboard"></i>
        </div>
        {hasActiveFilters ? (<>
            <h3>No matching tasks</h3>
            <p>Try adjusting your search or filters</p>
          </>) : (<>
            <h3>No tasks found</h3>
            <p>There are no tasks in the {selectedCategory} category yet</p>
          </>)}
      </div>);
    }
    return (<div className="task-column">
      <div className="task-column-header">
        <h3>{selectedCategory}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div className="task-list">
        {tasks.map((task) => (<TaskItem_1.default key={task.id} task={task} onSelect={onTaskSelect}/>))}
      </div>
    </div>);
};
exports.default = TaskList;
