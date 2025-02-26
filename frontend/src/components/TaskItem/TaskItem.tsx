// src/components/TaskItem/TaskItem.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Task, TaskStatus } from '../../interfaces/Task';
import { useTaskContext } from '../../context/TaskContext';
import { formatDate, getTimeLeft } from '../../utils/dateUtils';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onSelect?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onSelect }) => {
  const { updateTaskStatus, deleteTask } = useTaskContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setShowMenu(false);
    setIsLoading(true);
    try {
      await updateTaskStatus(task.id, newStatus);
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowMenu(false);
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsLoading(true);
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMenu = (e: React.MouseEvent) => {
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
      case TaskStatus.TODO:
        return '#5a6eee';
      case TaskStatus.IN_PROGRESS:
        return '#ff9f43';
      case TaskStatus.DONE:
        return '#28c76f';
      case TaskStatus.TIMEOUT:
        return '#ea5455';
      default:
        return '#5a6eee';
    }
  };

  return (
    <div 
      className={`task-card ${isLoading ? 'loading' : ''}`}
      onClick={handleTaskClick}
    >
      <div className="task-status-indicator" style={{ backgroundColor: getStatusColor() }} />
      
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description.substring(0, 80)}...</p>
        
        <div className="task-meta">
          {task.deadline && (
            <div className="task-deadline">
              <i className="far fa-clock"></i>
              <span>{getTimeLeft(task.deadline)}</span>
            </div>
          )}
          
          <div className="task-date">
            <span>Deadline: {task.deadline ? formatDate(task.deadline) : 'Not set'}</span>
          </div>
        </div>
      </div>
      
      <div className="task-actions" ref={menuRef}>
        <button className="task-action-btn more-btn" onClick={toggleMenu}>
          <i className="fas fa-ellipsis-h"></i>
        </button>

        {showMenu && (
          <div className="task-menu">
            <ul>
              <li onClick={() => onSelect && onSelect(task.id)}>
                <i className="fas fa-edit"></i> Edit
              </li>
              {task.status !== TaskStatus.TODO && (
                <li onClick={() => handleStatusChange(TaskStatus.TODO)}>
                  <i className="fas fa-list"></i> Move to To Do
                </li>
              )}
              {task.status !== TaskStatus.IN_PROGRESS && (
                <li onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}>
                  <i className="fas fa-spinner"></i> Move to In Progress
                </li>
              )}
              {task.status !== TaskStatus.DONE && (
                <li onClick={() => handleStatusChange(TaskStatus.DONE)}>
                  <i className="fas fa-check-circle"></i> Mark as Done
                </li>
              )}
              <li onClick={handleDelete} className="delete-option">
                <i className="fas fa-trash-alt"></i> Delete
              </li>
            </ul>
          </div>
        )}
      </div>
      
      {isLoading && (
        <div className="task-loader">
          <div className="loader-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;