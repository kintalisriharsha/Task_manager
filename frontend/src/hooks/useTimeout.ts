import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '../interfaces/Task';
import { taskService } from '../services/taskService';
import { isTaskTimedOut, updateTaskTimeoutStatus } from '../utils/timeoutHandler';

interface UseTimeoutReturn {
  checkTimeouts: () => void;
}

export const useTimeout = (
  tasks: Task[],
  updateTaskFn: (updatedTask: Task) => void
): UseTimeoutReturn => {
  const [lastCheckTime, setLastCheckTime] = useState<Date>(new Date());

  const checkTimeouts = useCallback(() => {
    const now = new Date();
    setLastCheckTime(now);
    
    // Check each task for timeout
    tasks.forEach(task => {
      if (isTaskTimedOut(task) && !task.isTimeout) {
        const updatedTask = updateTaskTimeoutStatus(task);
        
        // Update task in state
        updateTaskFn(updatedTask);
        
        // Update task on the server
        taskService.updateTaskStatus(task.id, TaskStatus.TIMEOUT)
          .catch(error => {
            console.error(`Failed to update timeout status for task ${task.id}:`, error);
          });
      }
    });
  }, [tasks, updateTaskFn]);

  // Check for timeouts every minute
  useEffect(() => {
    const intervalId = setInterval(checkTimeouts, 60000);
    
    // Initial check
    checkTimeouts();
    
    return () => clearInterval(intervalId);
  }, [checkTimeouts]);

  return { checkTimeouts };
};