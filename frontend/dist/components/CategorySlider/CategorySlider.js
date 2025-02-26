"use strict";
// src/components/CategorySlider/CategorySlider.tsx
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Task_1 = require("../../interfaces/Task");
const TaskContext_1 = require("../../context/TaskContext");
require("./CategorySlider.css");
const CategorySlider = () => {
    const { selectedCategory, setSelectedCategory } = (0, TaskContext_1.useTaskContext)();
    const categories = [
        Task_1.TaskStatus.TODO,
        Task_1.TaskStatus.IN_PROGRESS,
        Task_1.TaskStatus.DONE,
        Task_1.TaskStatus.TIMEOUT
    ];
    return (<div className="category-slider-container">
      <div className="category-tabs">
        {categories.map((category) => (<div key={category} className={`category-tab ${selectedCategory === category ? 'active' : ''}`} onClick={() => setSelectedCategory(category)}>
            <div className="tab-indicator"></div>
            <span>{category}</span>
          </div>))}
      </div>
    </div>);
};
exports.default = CategorySlider;
