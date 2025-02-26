// src/components/CategorySlider/CategorySlider.tsx

import React from 'react';
import { TaskStatus } from '../../interfaces/Task';
import { useTaskContext } from '../../context/TaskContext';
import './CategorySlider.css';

const CategorySlider: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useTaskContext();
  
  const categories = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
    TaskStatus.TIMEOUT
  ];
  
  return (
    <div className="category-slider-container">
      <div className="category-tabs">
        {categories.map((category) => (
          <div
            key={category}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            <div className="tab-indicator"></div>
            <span>{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;