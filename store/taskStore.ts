import { create } from 'zustand';
import { User } from 'firebase/auth';
import { syncWithFirestore, saveTasks, saveDailyProgress } from '../services/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  isLoading: boolean;
  isSynced: boolean;
  // Actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (taskIds: string[]) => void;
  recordProgress: (taskId: string, level: ProgressLevel, date?: string) => void;
  getDailyProgress: (date: string) => DailyProgress | undefined;
  syncWithFirebase: (user: User | null) => Promise<void>;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

// Storage keys
const TASKS_STORAGE_KEY = '@circle_tracker:tasks';
const PROGRESS_STORAGE_KEY = '@circle_tracker:daily_progress';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Create store
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  dailyProgress: [],
  isLoading: false,
  isSynced: false,

  // Add a new task
  addTask: (task) => {
    const { tasks } = get();
    // Only allow up to 7 tasks
    if (tasks.length >= 7) {
      console.warn('Maximum of 7 tasks reached');
      return;
    }
    
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: generateId() }],
      isSynced: false
    }));
    
    // Save to storage after update
    get().saveToStorage();
  },

  // Update an existing task
  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ),
      isSynced: false
    }));
    
    // Save to storage after update
    get().saveToStorage();
  },

  // Delete a task
  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter(task => task.id !== id),
      isSynced: false
    }));
    
    // Save to storage after update
    get().saveToStorage();
  },

  // Reorder tasks
  reorderTasks: (taskIds) => {
    set((state) => {
      const orderedTasks = taskIds.map((id, index) => {
        const task = state.tasks.find(t => t.id === id);
        return task ? { ...task, order: index } : null;
      }).filter(Boolean) as Task[];
      
      return { 
        tasks: orderedTasks,
        isSynced: false
      };
    });
    
    // Save to storage after update
    get().saveToStorage();
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
        return { 
          dailyProgress: updatedProgress,
          isSynced: false
        };
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
          ],
          isSynced: false
        };
      }
    });
    
    // Save to storage after update
    get().saveToStorage();
  },

  // Get progress for a specific date
  getDailyProgress: (date) => {
    return get().dailyProgress.find(p => p.date === date);
  },
  
  // Sync tasks and progress with Firebase
  syncWithFirebase: async (user: User | null) => {
    try {
      set({ isLoading: true });
      
      const { tasks, dailyProgress } = await syncWithFirestore(
        user, 
        get().tasks, 
        get().dailyProgress
      );
      
      set({ 
        tasks, 
        dailyProgress,
        isSynced: true,
        isLoading: false
      });
      
      // Save synced data to local storage
      get().saveToStorage();
    } catch (error) {
      console.error('Error syncing with Firebase:', error);
      set({ isLoading: false });
    }
  },
  
  // Load data from AsyncStorage
  loadFromStorage: async () => {
    try {
      set({ isLoading: true });
      
      const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      const progressJson = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      
      const tasks = tasksJson ? JSON.parse(tasksJson) : [];
      const dailyProgress = progressJson ? JSON.parse(progressJson) : [];
      
      set({ 
        tasks, 
        dailyProgress,
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading from storage:', error);
      set({ isLoading: false });
    }
  },
  
  // Save data to AsyncStorage
  saveToStorage: async () => {
    try {
      const { tasks, dailyProgress } = get();
      
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(dailyProgress));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }
})); 