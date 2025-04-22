import { firestore } from './firebase';
import { Task, DailyProgress, ProgressLevel } from '../store/taskStore';
import { User } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  writeBatch,
  getDocs,
  enableIndexedDbPersistence
} from 'firebase/firestore';

// Collection names
const TASKS_COLLECTION = 'tasks';
const PROGRESS_COLLECTION = 'dailyProgress';

// Enable offline persistence (might fail in some environments but we'll catch it)
try {
  enableIndexedDbPersistence(firestore)
    .then(() => {
      console.log('Firestore persistence has been enabled.');
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence is not available in this environment');
      } else {
        console.warn('Firestore persistence error:', err);
      }
    });
} catch (err) {
  console.warn('Could not enable Firestore persistence:', err);
}

// Utils for error handling and retries
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function withRetry<T>(operation: () => Promise<T>, retries = MAX_RETRIES, delay = RETRY_DELAY): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Operation failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay);
    }
    throw error;
  }
}

/**
 * Save tasks to Firestore
 * @param userId - The user ID to associate the tasks with
 * @param tasks - The tasks to save
 */
export const saveTasks = async (userId: string, tasks: Task[]): Promise<void> => {
  if (!userId) {
    console.error('Cannot save tasks: User ID is undefined');
    return;
  }

  try {
    return await withRetry(async () => {
      const tasksRef = doc(firestore, TASKS_COLLECTION, userId);
      await setDoc(tasksRef, { tasks, lastUpdated: new Date().toISOString() });
      console.log(`Successfully saved ${tasks.length} tasks for user ${userId}`);
    });
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
  if (!userId) {
    console.error('Cannot load tasks: User ID is undefined');
    return [];
  }

  try {
    return await withRetry(async () => {
      const tasksRef = doc(firestore, TASKS_COLLECTION, userId);
      const docSnap = await getDoc(tasksRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(`Successfully loaded ${data?.tasks?.length || 0} tasks for user ${userId}`);
        return data?.tasks || [];
      }
      
      console.log(`No tasks found for user ${userId}`);
      return [];
    });
  } catch (error) {
    console.error('Error loading tasks from Firestore:', error);
    return []; // Return empty array on error for smoother user experience
  }
};

/**
 * Save daily progress to Firestore
 * @param userId - The user ID to associate the progress with
 * @param progress - The daily progress to save
 */
export const saveDailyProgress = async (userId: string, progress: DailyProgress[]): Promise<void> => {
  if (!userId) {
    console.error('Cannot save progress: User ID is undefined');
    return;
  }

  try {
    return await withRetry(async () => {
      const progressRef = doc(firestore, PROGRESS_COLLECTION, userId);
      await setDoc(progressRef, { 
        dailyProgress: progress,
        lastUpdated: new Date().toISOString()
      });
      console.log(`Successfully saved progress for user ${userId}`);
    });
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
  if (!userId) {
    console.error('Cannot load progress: User ID is undefined');
    return [];
  }

  try {
    return await withRetry(async () => {
      const progressRef = doc(firestore, PROGRESS_COLLECTION, userId);
      const docSnap = await getDoc(progressRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(`Successfully loaded progress for user ${userId}`);
        return data?.dailyProgress || [];
      }
      
      console.log(`No progress found for user ${userId}`);
      return [];
    });
  } catch (error) {
    console.error('Error loading progress from Firestore:', error);
    return []; // Return empty array on error for smoother user experience
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
    console.log('No user, will not sync with Firestore');
    return { tasks: localTasks, dailyProgress: localProgress };
  }
  
  try {
    console.log(`Starting sync for user ${user.uid}`);
    
    // Save local data to Firestore first
    await saveTasks(user.uid, localTasks);
    await saveDailyProgress(user.uid, localProgress);
    
    // Then load the data from Firestore
    const tasksFromFirestore = await loadTasks(user.uid);
    const progressFromFirestore = await loadDailyProgress(user.uid);
    
    console.log('Sync completed successfully');
    
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