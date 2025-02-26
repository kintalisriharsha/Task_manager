"use strict";
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
require("./TaskForm.css");
const TaskForm = ({ onClose, isOpen, taskId, onTaskCreated }) => {
    const { createTask, updateTask, tasks, isLoading } = (0, TaskContext_1.useTaskContext)();
    const initialFormState = (0, react_1.useMemo)(() => ({
        title: '',
        description: '',
        status: Task_1.TaskStatus.TODO,
        duration: 30,
        deadline: undefined
    }), []);
    const [formData, setFormData] = (0, react_1.useState)(initialFormState);
    const [errors, setErrors] = (0, react_1.useState)({});
    const [deadlineDate, setDeadlineDate] = (0, react_1.useState)('');
    const [deadlineTime, setDeadlineTime] = (0, react_1.useState)('');
    const [isEditMode, setIsEditMode] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            // If a taskId is provided, it's edit mode
            if (taskId) {
                const taskToEdit = tasks.find(t => t.id === taskId);
                if (taskToEdit) {
                    setIsEditMode(true);
                    setFormData({
                        title: taskToEdit.title,
                        description: taskToEdit.description,
                        status: taskToEdit.status,
                        duration: taskToEdit.duration,
                        deadline: taskToEdit.deadline
                    });
                    // Set deadline date and time if available
                    if (taskToEdit.deadline) {
                        const date = new Date(taskToEdit.deadline);
                        setDeadlineDate(date.toISOString().split('T')[0]);
                        setDeadlineTime(date.toTimeString().slice(0, 5));
                    }
                }
            }
            else {
                // Reset form for new task
                setIsEditMode(false);
                setFormData(initialFormState);
                setErrors({});
                setDeadlineDate('');
                setDeadlineTime('');
            }
        }
    }, [initialFormState, isOpen, taskId, tasks]);
    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (formData.duration <= 0) {
            newErrors.duration = 'Duration must be greater than 0';
        }
        if (deadlineDate && !deadlineTime) {
            newErrors.deadline = 'Please specify a time for the deadline';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
        // Clear error on change
        if (errors[name]) {
            setErrors((prev) => (Object.assign(Object.assign({}, prev), { [name]: undefined })));
        }
    };
    const handleDateChange = (e) => {
        setDeadlineDate(e.target.value);
        // Clear deadline error
        if (errors.deadline) {
            setErrors((prev) => (Object.assign(Object.assign({}, prev), { deadline: undefined })));
        }
    };
    const handleTimeChange = (e) => {
        setDeadlineTime(e.target.value);
        // Clear deadline error
        if (errors.deadline) {
            setErrors((prev) => (Object.assign(Object.assign({}, prev), { deadline: undefined })));
        }
    };
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        // Combine date and time for deadline if both are provided
        let deadlineObj = undefined;
        if (deadlineDate && deadlineTime) {
            deadlineObj = new Date(`${deadlineDate}T${deadlineTime}`);
        }
        const taskData = Object.assign(Object.assign({}, formData), { deadline: deadlineObj });
        try {
            if (isEditMode && taskId) {
                yield updateTask(taskId, taskData);
            }
            else {
                yield createTask(taskData);
                if (onTaskCreated) {
                    onTaskCreated();
                }
            }
            onClose();
        }
        catch (error) {
            setErrors((prev) => (Object.assign(Object.assign({}, prev), { form: 'An error occurred. Please try again.' })));
        }
    });
    return (<div className="task-form-container">
      <div className="task-form-header">
        <h2>{isEditMode ? 'EDIT TASK' : 'ADD TASK'}</h2>
        <button className="close-button" onClick={onClose} disabled={isLoading}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">TASK</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter task title" disabled={isLoading} className={errors.title ? 'error' : ''}/>
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter task description" rows={6} disabled={isLoading} className={errors.description ? 'error' : ''}/>
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} disabled={isLoading}>
              <option value={Task_1.TaskStatus.TODO}>{Task_1.TaskStatus.TODO}</option>
              <option value={Task_1.TaskStatus.IN_PROGRESS}>{Task_1.TaskStatus.IN_PROGRESS}</option>
              <option value={Task_1.TaskStatus.DONE}>{Task_1.TaskStatus.DONE}</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} min="1" disabled={isLoading} className={errors.duration ? 'error' : ''}/>
            {errors.duration && <div className="error-message">{errors.duration}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label>Deadline</label>
          <div className="deadline-container">
            <input type="date" id="deadlineDate" name="deadlineDate" value={deadlineDate} onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} disabled={isLoading}/>
            
            <input type="time" id="deadlineTime" name="deadlineTime" value={deadlineTime} onChange={handleTimeChange} disabled={isLoading} className={errors.deadline ? 'error' : ''}/>
          </div>
          {errors.deadline && <div className="error-message">{errors.deadline}</div>}
        </div>
        
        <div className="form-group">
          <label>Assigned to</label>
          <div className="assignee-selection">
            <div className="assignee-avatar">
              <span>T</span>
            </div>
            <div className="assignee-avatar">
              <span>A</span>
            </div>
            <div className="assignee-avatar add-assignee">
              <i className="fas fa-plus"></i>
            </div>
          </div>
        </div>
        
        {errors.form && <div className="form-error-message">{errors.form}</div>}
        
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Processing...' : isEditMode ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>);
};
exports.default = TaskForm;
