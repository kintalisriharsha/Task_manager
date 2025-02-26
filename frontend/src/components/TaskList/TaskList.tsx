// src/components/TaskList/TaskList.tsx

import React from 'react';
import { useTaskContext } from '../../context/TaskContext';
import TaskItem from '../TaskItem';
import './TaskList.css';

interface TaskListProps {
  onTaskSelect?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onTaskSelect }) => {
  const { 
    selectedCategory, 
    getTasksByCategory, 
    isLoading, 
    error,
    searchTerm,
    filterOptions
  } = useTaskContext();
  
  const tasks = getTasksByCategory(selectedCategory);
  const hasActiveFilters = searchTerm.trim() !== '' || 
    filterOptions.status !== 'all' || 
    filterOptions.deadline !== 'all' || 
    filterOptions.duration !== 'all';
  
  if (isLoading) {
    return (
      <div className="task-list-loader">
        <div className="loader-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="task-list-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-illustration">
          <i className="far fa-clipboard"></i>
        </div>
        {hasActiveFilters ? (
          <>
            <h3>No matching tasks</h3>
            <p>Try adjusting your search or filters</p>
          </>
        ) : (
          <>
            <h3>No tasks found</h3>
            <p>There are no tasks in the {selectedCategory} category yet</p>
          </>
        )}
      </div>
    );
  }
  
  return (
    <div className="task-column">
      <div className="task-column-header">
        <h3>{selectedCategory}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onSelect={onTaskSelect} 
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;