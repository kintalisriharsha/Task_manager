// src/components/TaskSuccess/TaskSuccess.tsx

import React from 'react';
import './TaskSuccess.css';

interface TaskSuccessProps {
  onClose: () => void;
}

const TaskSuccess: React.FC<TaskSuccessProps> = ({ onClose }) => {
  return (
    <div className="task-success-overlay">
      <div className="task-success-container">
        <div className="success-icon">
          <i className="fas fa-check"></i>
        </div>
        <h3>Add Task Success</h3>
        <p>New task has been created successfully</p>
        <button className="success-button" onClick={onClose}>
          Back
        </button>
      </div>
    </div>
  );
};

export default TaskSuccess;