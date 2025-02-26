import React from 'react';
import { useTaskContext, FilterOptions } from '../../context/TaskContext';
import { TaskStatus } from '../../interfaces/Task';
import './FilterPanel.css';

const FilterPanel: React.FC = () => {
  const { 
    filterOptions, 
    setFilterOptions, 
    resetFilters, 
    showFilters, 
    setShowFilters 
  } = useTaskContext();

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilterOptions({
      ...filterOptions,
      [key]: value
    });
  };

  const handleReset = () => {
    resetFilters();
  };

  if (!showFilters) return null;

  return (
    <div className="filter-panel">
      <div className="filter-panel-header">
        <h3>Filter Tasks</h3>
        <button className="close-filter-btn" onClick={() => setShowFilters(false)}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="filter-section">
        <h4>Status</h4>
        <select 
          value={filterOptions.status} 
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value={TaskStatus.TODO}>{TaskStatus.TODO}</option>
          <option value={TaskStatus.IN_PROGRESS}>{TaskStatus.IN_PROGRESS}</option>
          <option value={TaskStatus.DONE}>{TaskStatus.DONE}</option>
          <option value={TaskStatus.TIMEOUT}>{TaskStatus.TIMEOUT}</option>
        </select>
      </div>

      <div className="filter-section">
        <h4>Deadline</h4>
        <select 
          value={filterOptions.deadline} 
          onChange={(e) => handleFilterChange('deadline', e.target.value)}
        >
          <option value="all">All Deadlines</option>
          <option value="today">Due Today</option>
          <option value="thisWeek">Due This Week</option>
          <option value="overdue">Overdue</option>
          <option value="noDeadline">No Deadline</option>
        </select>
      </div>

      <div className="filter-section">
        <h4>Duration</h4>
        <select 
          value={filterOptions.duration} 
          onChange={(e) => handleFilterChange('duration', e.target.value)}
        >
          <option value="all">All Durations</option>
          <option value="lessThan30">Less than 30 minutes</option>
          <option value="30to60">30 - 60 minutes</option>
          <option value="60to120">1 - 2 hours</option>
          <option value="moreThan120">More than 2 hours</option>
        </select>
      </div>

      <div className="filter-actions">
        <button 
          className="reset-filter-btn" 
          onClick={handleReset}
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;