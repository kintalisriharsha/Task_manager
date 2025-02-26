import React, { useState } from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import CategorySlider from './components/CategorySlider';
import TaskList from './components/TaskList/TaskList';
import TaskForm from './components/TaskForm';
import Calendar from './components/Calender'; 
import TaskSuccess from './components/TaskSuccess';
import FilterPanel from './components/FilterPanel';
import './App.css';

// SearchBar component
const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm, showFilters, setShowFilters } = useTaskContext();

  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder="Search tasks..." 
        className="search-input" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button 
        className={`filter-button ${showFilters ? 'active' : ''}`} 
        onClick={() => setShowFilters(!showFilters)}
      >
        <i className="fas fa-filter"></i>
        Filter
      </button>
      <FilterPanel />
    </div>
  );
};

// Main TaskStats component
const TaskStats: React.FC = () => {
  const { tasks } = useTaskContext();
  
  // Count tasks by status
  const expiredCount = tasks.filter(task => task.status === 'Timeout').length;
  const activeCount = tasks.filter(task => task.status === 'To Do' || task.status === 'In Progress').length;
  const completedCount = tasks.filter(task => task.status === 'Done').length;

  return (
    <div className="sidebar">
      <div className="sidebar-item">
        <div className="sidebar-icon expired">
          <i className="fas fa-clock"></i>
        </div>
        <div className="sidebar-text">
          <p>Expired Tasks</p>
          <h2>{expiredCount}</h2>
        </div>
      </div>
      
      <div className="sidebar-item">
        <div className="sidebar-icon active">
          <i className="fas fa-tasks"></i>
        </div>
        <div className="sidebar-text">
          <p>All Active Tasks</p>
          <h2>{activeCount}</h2>
        </div>
      </div>
      
      <div className="sidebar-item">
        <div className="sidebar-icon completed">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="sidebar-text">
          <p>Completed Tasks</p>
          <h2>{completedCount}</h2>
        </div>
      </div>
    </div>
  );
};

// Main App component
const AppContent: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const openForm = () => {
    setIsFormOpen(true);
    setSelectedTaskId(null);
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
  };
  
  const handleTaskCreated = () => {
    closeForm();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsFormOpen(true);
  };

  return (
    <div className="app-container">
      <div className={`app-main ${isFormOpen ? '' : 'full-width'}`}>
        <header className="app-header">
          <SearchBar />
        </header>
        
        <div className="app-content">
          <TaskStats />
          
          <div className="task-board">
            <CategorySlider />
            <TaskList onTaskSelect={handleTaskSelect} />
          </div>
        </div>
        
        <button className="add-task-button-main" onClick={openForm}>
          + Add Task
        </button>
      </div>
      
      {isFormOpen && (
        <div className="app-sidebar">
          <TaskForm 
            onClose={closeForm} 
            isOpen={isFormOpen} 
            taskId={selectedTaskId}
            onTaskCreated={handleTaskCreated}
          />
          <div className="sidebar-calendar">
            <h3>Calendar</h3>
            <Calendar />
          </div>
        </div>
      )}
      
      {showSuccess && <TaskSuccess onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

export default App;