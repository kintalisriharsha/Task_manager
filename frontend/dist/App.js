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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const TaskContext_1 = require("./context/TaskContext");
const CategorySlider_1 = __importDefault(require("./components/CategorySlider"));
const TaskList_1 = __importDefault(require("./components/TaskList/TaskList"));
const TaskForm_1 = __importDefault(require("./components/TaskForm"));
const Calender_1 = __importDefault(require("./components/Calender"));
const TaskSuccess_1 = __importDefault(require("./components/TaskSuccess"));
const FilterPanel_1 = __importDefault(require("./components/FilterPanel"));
require("./App.css");
// SearchBar component
const SearchBar = () => {
    const { searchTerm, setSearchTerm, showFilters, setShowFilters } = (0, TaskContext_1.useTaskContext)();
    return (<div className="search-container">
      <input type="text" placeholder="Search tasks..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      <button className={`filter-button ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
        <i className="fas fa-filter"></i>
        Filter
      </button>
      <FilterPanel_1.default />
    </div>);
};
// Main TaskStats component
const TaskStats = () => {
    const { tasks } = (0, TaskContext_1.useTaskContext)();
    // Count tasks by status
    const expiredCount = tasks.filter(task => task.status === 'Timeout').length;
    const activeCount = tasks.filter(task => task.status === 'To Do' || task.status === 'In Progress').length;
    const completedCount = tasks.filter(task => task.status === 'Done').length;
    return (<div className="sidebar">
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
    </div>);
};
// Main App component
const AppContent = () => {
    const [isFormOpen, setIsFormOpen] = (0, react_1.useState)(false);
    const [selectedTaskId, setSelectedTaskId] = (0, react_1.useState)(null);
    const [showSuccess, setShowSuccess] = (0, react_1.useState)(false);
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
    const handleTaskSelect = (taskId) => {
        setSelectedTaskId(taskId);
        setIsFormOpen(true);
    };
    return (<div className="app-container">
      <div className={`app-main ${isFormOpen ? '' : 'full-width'}`}>
        <header className="app-header">
          <SearchBar />
        </header>
        
        <div className="app-content">
          <TaskStats />
          
          <div className="task-board">
            <CategorySlider_1.default />
            <TaskList_1.default onTaskSelect={handleTaskSelect}/>
          </div>
        </div>
        
        <button className="add-task-button-main" onClick={openForm}>
          + Add Task
        </button>
      </div>
      
      {isFormOpen && (<div className="app-sidebar">
          <TaskForm_1.default onClose={closeForm} isOpen={isFormOpen} taskId={selectedTaskId} onTaskCreated={handleTaskCreated}/>
          <div className="sidebar-calendar">
            <h3>Calendar</h3>
            <Calender_1.default />
          </div>
        </div>)}
      
      {showSuccess && <TaskSuccess_1.default onClose={() => setShowSuccess(false)}/>}
    </div>);
};
const App = () => {
    return (<TaskContext_1.TaskProvider>
      <AppContent />
    </TaskContext_1.TaskProvider>);
};
exports.default = App;
