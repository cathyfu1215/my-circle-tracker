import { create } from 'zustand';

// Progress level enum
export enum ProgressLevel {
  NOTHING = 0,
  MINIMAL = 1,
  TARGET = 2,
  BEYOND_TARGET = 3
}

// Task interface
export interface Task {
  id: string;
  name: string;
  color: string;
  order: number;
}

// Daily progress interface
export interface DailyProgress {
  date: string; // ISO date string
  taskProgress: {
    [taskId: string]: ProgressLevel;
  };
}

// Store state interface
interface TaskState {
  tasks: Task[];
  dailyProgress: DailyProgress[];
  // Actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (taskIds: string[]) => void;
  recordProgress: (taskId: string, level: ProgressLevel, date?: string) => void;
  getDailyProgress: (date: string) => DailyProgress | undefined;
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Create store
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  dailyProgress: [],

  // Add a new task
  addTask: (task) => {
    const { tasks } = get();
    // Only allow up to 7 tasks
    if (tasks.length >= 7) {
      console.warn('Maximum of 7 tasks reached');
      return;
    }
    
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: generateId() }]
    }));
  },

  // Update an existing task
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  },

  // Delete a task
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== id)
    }));
  },

  // Reorder tasks
  reorderTasks: (taskIds) => {
    set((state) => {
      const orderedTasks = taskIds.map((id, index) => {
        const task = state.tasks.find(t => t.id === id);
        return task ? { ...task, order: index } : null;
      }).filter(Boolean) as Task[];
      
      return { tasks: orderedTasks };
    });
  },

  // Record progress for a task
  recordProgress: (taskId, level, date = new Date().toISOString().slice(0, 10)) => {
    set((state) => {
      const existingProgressIndex = state.dailyProgress.findIndex(p => p.date === date);
      
      // If we already have progress for this date
      if (existingProgressIndex >= 0) {
        const updatedProgress = [...state.dailyProgress];
        updatedProgress[existingProgressIndex] = {
          ...updatedProgress[existingProgressIndex],
          taskProgress: {
            ...updatedProgress[existingProgressIndex].taskProgress,
            [taskId]: level
          }
        };
        return { dailyProgress: updatedProgress };
      } 
      // Otherwise create a new entry
      else {
        return {
          dailyProgress: [
            ...state.dailyProgress,
            {
              date,
              taskProgress: { [taskId]: level }
            }
          ]
        };
      }
    });
  },

  // Get progress for a specific date
  getDailyProgress: (date) => {
    return get().dailyProgress.find(p => p.date === date);
  }
})); 