"use strict";
// src/components/TaskItem/TaskItem.tsx
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
const react_1 = __importStar(require("react"));
const Task_1 = require("../../interfaces/Task");
const TaskContext_1 = require("../../context/TaskContext");
const dateUtils_1 = require("../../utils/dateUtils");
require("./TaskItem.css");
const TaskItem = ({ task, onSelect }) => {
    const { updateTaskStatus, deleteTask } = (0, TaskContext_1.useTaskContext)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [showMenu, setShowMenu] = (0, react_1.useState)(false);
    const menuRef = (0, react_1.useRef)(null);
    // Close the menu when clicking outside of it
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleStatusChange = (newStatus) => __awaiter(void 0, void 0, void 0, function* () {
        setShowMenu(false);
        setIsLoading(true);
        try {
            yield updateTaskStatus(task.id, newStatus);
        }
        catch (error) {
            console.error('Error updating task status:', error);
        }
        finally {
            setIsLoading(false);
        }
    });
    const handleDelete = () => __awaiter(void 0, void 0, void 0, function* () {
        setShowMenu(false);
        if (window.confirm('Are you sure you want to delete this task?')) {
            setIsLoading(true);
            try {
                yield deleteTask(task.id);
            }
            catch (error) {
                console.error('Error deleting task:', error);
            }
            finally {
                setIsLoading(false);
            }
        }
    });
    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };
    const handleTaskClick = () => {
        if (onSelect) {
            onSelect(task.id);
        }
    };
    const getStatusColor = () => {
        switch (task.status) {
            case Task_1.TaskStatus.TODO:
                return '#5a6eee';
            case Task_1.TaskStatus.IN_PROGRESS:
                return '#ff9f43';
            case Task_1.TaskStatus.DONE:
                return '#28c76f';
            case Task_1.TaskStatus.TIMEOUT:
                return '#ea5455';
            default:
                return '#5a6eee';
        }
    };
    return (<div className={`task-card ${isLoading ? 'loading' : ''}`} onClick={handleTaskClick}>
      <div className="task-status-indicator" style={{ backgroundColor: getStatusColor() }}/>
      
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description.substring(0, 80)}...</p>
        
        <div className="task-meta">
          {task.deadline && (<div className="task-deadline">
              <i className="far fa-clock"></i>
              <span>{(0, dateUtils_1.getTimeLeft)(task.deadline)}</span>
            </div>)}
          
          <div className="task-date">
            <span>Deadline: {task.deadline ? (0, dateUtils_1.formatDate)(task.deadline) : 'Not set'}</span>
          </div>
        </div>
      </div>
      
      <div className="task-actions" ref={menuRef}>
        <button className="task-action-btn more-btn" onClick={toggleMenu}>
          <i className="fas fa-ellipsis-h"></i>
        </button>

        {showMenu && (<div className="task-menu">
            <ul>
              <li onClick={() => onSelect && onSelect(task.id)}>
                <i className="fas fa-edit"></i> Edit
              </li>
              {task.status !== Task_1.TaskStatus.TODO && (<li onClick={() => handleStatusChange(Task_1.TaskStatus.TODO)}>
                  <i className="fas fa-list"></i> Move to To Do
                </li>)}
              {task.status !== Task_1.TaskStatus.IN_PROGRESS && (<li onClick={() => handleStatusChange(Task_1.TaskStatus.IN_PROGRESS)}>
                  <i className="fas fa-spinner"></i> Move to In Progress
                </li>)}
              {task.status !== Task_1.TaskStatus.DONE && (<li onClick={() => handleStatusChange(Task_1.TaskStatus.DONE)}>
                  <i className="fas fa-check-circle"></i> Mark as Done
                </li>)}
              <li onClick={handleDelete} className="delete-option">
                <i className="fas fa-trash-alt"></i> Delete
              </li>
            </ul>
          </div>)}
      </div>
      
      {isLoading && (<div className="task-loader">
          <div className="loader-spinner"></div>
        </div>)}
    </div>);
};
exports.default = TaskItem;
