import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTaskStore, Task } from '../store/taskStore';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useFirestoreSyncContext } from '../features/sync/FirestoreSyncProvider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { THEME_COLORS } from '../constants/colors';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { logout, user } = useAuth();
  const { isLoading, isSynced, syncNow } = useFirestoreSyncContext();
  
  // Local state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Get tasks from store
  const { tasks, addTask, updateTask, deleteTask, reorderTasks } = useTaskStore();
  
  // Sorted tasks by order
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  // Handle add task
  const handleAddTask = () => {
    setEditingTask({});
    setIsModalVisible(true);
  };

  // Handle save task
  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask?.id) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalVisible(false);
    setEditingTask(null);
  };

  // Handle cancel task
  const handleCancelTask = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };

  // Handle delete task
  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This will remove all progress data for this task.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTask(taskId)
        }
      ]
    );
  };

  // Handle manual sync
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncNow();
      Alert.alert('Sync Complete', 'Your data has been synced successfully.');
    } catch (error) {
      Alert.alert('Sync Failed', 'There was a problem syncing your data. Please try again later.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      // Navigation handled by auth state change
    } catch (error) {
      Alert.alert('Logout Failed', 'There was a problem logging out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {sortedTasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskInfo}>
                <View style={[styles.colorIndicator, { backgroundColor: task.color }]} />
                <Text style={styles.taskName}>{task.name}</Text>
              </View>
              <View style={styles.taskActions}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEditTask(task)}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTask(task.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {tasks.length < 7 && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddTask}
            >
              <Text style={styles.addButtonText}>+ Add Task</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Sync</Text>
            <View style={styles.syncStatusContainer}>
              <Text style={styles.syncStatusLabel}>Sync Status:</Text>
              <Text style={[
                styles.syncStatus, 
                { color: isSynced ? THEME_COLORS.success : THEME_COLORS.warning }
              ]}>
                {isSynced ? 'Synced' : 'Not Synced'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.syncButton}
              onPress={handleSync}
              disabled={isSyncing || isLoading}
            >
              {(isSyncing || isLoading) ? (
                <ActivityIndicator color={THEME_COLORS.white} size="small" />
              ) : (
                <Text style={styles.syncButtonText}>Sync Now</Text>
              )}
            </TouchableOpacity>
            <Text style={styles.syncInfo}>
              Last synced data will be restored if you sign in on another device.
            </Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {user && (
            <View style={styles.accountInfo}>
              <Text style={styles.accountEmail}>{user.email}</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Task Edit/Add Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelTask}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTask?.id ? 'Edit Task' : 'Add New Task'}
            </Text>
            <TaskForm
              initialTask={editingTask || {}}
              onSave={handleSaveTask}
              onCancel={handleCancelTask}
              existingTaskCount={tasks.length}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.text,
  },
  backLink: {
    fontSize: 16,
    color: THEME_COLORS.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLORS.text,
    marginBottom: 15,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME_COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  taskName: {
    fontSize: 16,
    color: THEME_COLORS.text,
  },
  taskActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: THEME_COLORS.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    color: THEME_COLORS.text,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: THEME_COLORS.error,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: THEME_COLORS.white,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: THEME_COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: THEME_COLORS.text,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: THEME_COLORS.error,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: THEME_COLORS.white,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: THEME_COLORS.background,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  syncStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  syncStatusLabel: {
    fontSize: 16,
    color: THEME_COLORS.text,
    marginRight: 10,
  },
  syncStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  syncButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  syncButtonText: {
    color: THEME_COLORS.white,
    fontWeight: 'bold',
  },
  syncInfo: {
    fontSize: 14,
    color: THEME_COLORS.textLight,
    textAlign: 'center',
    marginBottom: 15,
  },
  accountInfo: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  accountEmail: {
    fontSize: 16,
    color: THEME_COLORS.text,
  },
});

export default SettingsScreen; 