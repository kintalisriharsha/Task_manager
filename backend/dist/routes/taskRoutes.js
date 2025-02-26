"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = __importDefault(require("../controllers/taskController"));
const router = (0, express_1.Router)();
// Task CRUD routes
router.get('/', taskController_1.default.getAllTasks);
router.get('/:id', taskController_1.default.getTaskById);
router.post('/', taskController_1.default.createTask);
router.put('/:id', taskController_1.default.updateTask);
router.delete('/:id', taskController_1.default.deleteTask);
// Additional routes
router.get('/system/check-timeouts', taskController_1.default.checkTimeouts);
router.get('/status/:status', taskController_1.default.getTasksByStatus);
router.get('/due/today', taskController_1.default.getTasksDueToday);
router.get('/due/overdue', taskController_1.default.getOverdueTasks);
exports.default = router;
