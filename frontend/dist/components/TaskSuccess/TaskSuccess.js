"use strict";
// src/components/TaskSuccess/TaskSuccess.tsx
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./TaskSuccess.css");
const TaskSuccess = ({ onClose }) => {
    return (<div className="task-success-overlay">
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
    </div>);
};
exports.default = TaskSuccess;
