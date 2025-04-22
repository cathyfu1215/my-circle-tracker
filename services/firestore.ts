import { firestore } from './firebase';
import { Task, DailyProgress, ProgressLevel } from '../store/taskStore';
import { User } from 'firebase/auth';

// Collection names
const TASKS_COLLECTION = 'tasks';
const PROGRESS_COLLECTION = 'dailyProgress';

/**
 * Save tasks to Firestore
 * @param userId - The user ID to associate the tasks with
 * @param tasks - The tasks to save
 */
export const saveTasks = async (userId: string, tasks: Task[]): Promise<void> => {
  try {
    const batch = firestore.batch();
    const tasksRef = firestore.collection(TASKS_COLLECTION).doc(userId);
    
    batch.set(tasksRef, { tasks });
    
    await batch.commit();
  } catch (error) {
    console.error('Error saving tasks to Firestore:', error);
    throw error;
  }
};

/**
 * Load tasks from Firestore
 * @param userId - The user ID to get tasks for
 * @returns Array of tasks or empty array if none found
 */
export const loadTasks = async (userId: string): Promise<Task[]> => {
  try {
    const tasksRef = firestore.collection(TASKS_COLLECTION).doc(userId);
    const doc = await tasksRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      return data?.tasks || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error loading tasks from Firestore:', error);
    throw error;
  }
};

/**
 * Save daily progress to Firestore
 * @param userId - The user ID to associate the progress with
 * @param progress - The daily progress to save
 */
export const saveDailyProgress = async (userId: string, progress: DailyProgress[]): Promise<void> => {
  try {
    const batch = firestore.batch();
    const progressRef = firestore.collection(PROGRESS_COLLECTION).doc(userId);
    
    batch.set(progressRef, { dailyProgress: progress });
    
    await batch.commit();
  } catch (error) {
    console.error('Error saving progress to Firestore:', error);
    throw error;
  }
};

/**
 * Load daily progress from Firestore
 * @param userId - The user ID to get progress for
 * @returns Array of daily progress or empty array if none found
 */
export const loadDailyProgress = async (userId: string): Promise<DailyProgress[]> => {
  try {
    const progressRef = firestore.collection(PROGRESS_COLLECTION).doc(userId);
    const doc = await progressRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      return data?.dailyProgress || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error loading progress from Firestore:', error);
    throw error;
  }
};

/**
 * Sync local tasks and progress with Firestore
 * If user is logged in, loads data from Firestore and returns it
 * @param user - The current user or null if not logged in
 * @param localTasks - The current local tasks
 * @param localProgress - The current local progress
 * @returns Object with tasks and progress, either from Firestore or unchanged local data
 */
export const syncWithFirestore = async (
  user: User | null,
  localTasks: Task[],
  localProgress: DailyProgress[]
): Promise<{ tasks: Task[], dailyProgress: DailyProgress[] }> => {
  if (!user) {
    return { tasks: localTasks, dailyProgress: localProgress };
  }
  
  try {
    // Save local data to Firestore first
    await saveTasks(user.uid, localTasks);
    await saveDailyProgress(user.uid, localProgress);
    
    // Then load the data from Firestore
    const tasksFromFirestore = await loadTasks(user.uid);
    const progressFromFirestore = await loadDailyProgress(user.uid);
    
    return { 
      tasks: tasksFromFirestore.length > 0 ? tasksFromFirestore : localTasks,
      dailyProgress: progressFromFirestore.length > 0 ? progressFromFirestore : localProgress
    };
  } catch (error) {
    console.error('Error syncing with Firestore:', error);
    // If there's an error, return the local data
    return { tasks: localTasks, dailyProgress: localProgress };
  }
}; 