import React, { useState, useEffect, useMemo } from 'react';
import { TaskFormData, TaskStatus } from '../../interfaces/Task';
import { useTaskContext } from '../../context/TaskContext';
import './TaskForm.css';

interface TaskFormProps {
  onClose: () => void;
  isOpen: boolean;
  taskId?: string | null;
  onTaskCreated?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, isOpen, taskId, onTaskCreated }) => {
  const { createTask, updateTask, tasks, isLoading } = useTaskContext();
  
  const initialFormState = useMemo(() => ({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    duration: 30,
    deadline: undefined
  } as TaskFormData), []);
  
  const [formData, setFormData] = useState<TaskFormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData | 'form', string>>>({});
  const [deadlineDate, setDeadlineDate] = useState<string>('');
  const [deadlineTime, setDeadlineTime] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  useEffect(() => {
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
      } else {
        // Reset form for new task
        setIsEditMode(false);
        setFormData(initialFormState);
        setErrors({});
        setDeadlineDate('');
        setDeadlineTime('');
      }
    }
  }, [initialFormState, isOpen, taskId, tasks]);
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error on change
    if (errors[name as keyof TaskFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadlineDate(e.target.value);
    
    // Clear deadline error
    if (errors.deadline) {
      setErrors((prev) => ({
        ...prev,
        deadline: undefined
      }));
    }
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadlineTime(e.target.value);
    
    // Clear deadline error
    if (errors.deadline) {
      setErrors((prev) => ({
        ...prev,
        deadline: undefined
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    // Combine date and time for deadline if both are provided
    let deadlineObj: Date | undefined = undefined;
    
    if (deadlineDate && deadlineTime) {
      deadlineObj = new Date(`${deadlineDate}T${deadlineTime}`);
    }
    
    const taskData: TaskFormData = {
      ...formData,
      deadline: deadlineObj
    };
    
    try {
      if (isEditMode && taskId) {
        await updateTask(taskId, taskData);
      } else {
        await createTask(taskData);
        if (onTaskCreated) {
          onTaskCreated();
        }
      }
      onClose();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: 'An error occurred. Please try again.'
      }));
    }
  };
  
  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>{isEditMode ? 'EDIT TASK' : 'ADD TASK'}</h2>
        <button className="close-button" onClick={onClose} disabled={isLoading}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">TASK</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            disabled={isLoading}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows={6}
            disabled={isLoading}
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value={TaskStatus.TODO}>{TaskStatus.TODO}</option>
              <option value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</option>
              <option value={TaskStatus.DONE}>{TaskStatus.DONE}</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              disabled={isLoading}
              className={errors.duration ? 'error' : ''}
            />
            {errors.duration && <div className="error-message">{errors.duration}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label>Deadline</label>
          <div className="deadline-container">
            <input
              type="date"
              id="deadlineDate"
              name="deadlineDate"
              value={deadlineDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              disabled={isLoading}
            />
            
            <input
              type="time"
              id="deadlineTime"
              name="deadlineTime"
              value={deadlineTime}
              onChange={handleTimeChange}
              disabled={isLoading}
              className={errors.deadline ? 'error' : ''}
            />
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
        
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : isEditMode ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;