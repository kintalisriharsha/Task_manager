"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTimeout = void 0;
const react_1 = require("react");
const Task_1 = require("../interfaces/Task");
const taskService_1 = require("../services/taskService");
const timeoutHandler_1 = require("../utils/timeoutHandler");
const useTimeout = (tasks, updateTaskFn) => {
    const [lastCheckTime, setLastCheckTime] = (0, react_1.useState)(new Date());
    const checkTimeouts = (0, react_1.useCallback)(() => {
        const now = new Date();
        setLastCheckTime(now);
        // Check each task for timeout
        tasks.forEach(task => {
            if ((0, timeoutHandler_1.isTaskTimedOut)(task) && !task.isTimeout) {
                const updatedTask = (0, timeoutHandler_1.updateTaskTimeoutStatus)(task);
                // Update task in state
                updateTaskFn(updatedTask);
                // Update task on the server
                taskService_1.taskService.updateTaskStatus(task.id, Task_1.TaskStatus.TIMEOUT)
                    .catch(error => {
                    console.error(`Failed to update timeout status for task ${task.id}:`, error);
                });
            }
        });
    }, [tasks, updateTaskFn]);
    // Check for timeouts every minute
    (0, react_1.useEffect)(() => {
        const intervalId = setInterval(checkTimeouts, 60000);
        // Initial check
        checkTimeouts();
        return () => clearInterval(intervalId);
    }, [checkTimeouts]);
    return { checkTimeouts };
};
exports.useTimeout = useTimeout;
