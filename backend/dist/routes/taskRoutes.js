"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// src/routes/taskRoutes.ts
const express_1 = require("express");
const taskController_1 = tslib_1.__importDefault(require("../controllers/taskController"));
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
// Task CRUD routes
router.get('/', taskController_1.default.getAllTasks);
router.get('/:id', validationMiddleware_1.validateIdParam, taskController_1.default.getTaskById);
router.post('/', validationMiddleware_1.validateTaskCreation, taskController_1.default.createTask);
router.put('/:id', validationMiddleware_1.validateIdParam, validationMiddleware_1.validateTaskUpdate, taskController_1.default.updateTask);
router.delete('/:id', validationMiddleware_1.validateIdParam, taskController_1.default.deleteTask);
// Task status update route
router.put('/:id/status', validationMiddleware_1.validateIdParam, taskController_1.default.updateTaskStatus);
// Timeout check route
router.get('/system/check-timeouts', taskController_1.default.checkTimeouts);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map