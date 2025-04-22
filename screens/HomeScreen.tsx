import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TaskCircle from '../components/TaskCircle';
import TaskListItem from '../components/TaskListItem';
import TaskForm from '../components/TaskForm';
import { useTaskStore, ProgressLevel, Task } from '../store/taskStore';
import { THEME_COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { getTodayString } from '../utils/dateUtils';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  // Local state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = getTodayString();
  
  // Access store data
  const { 
    tasks, 
    addTask,
    updateTask,
    deleteTask,
    recordProgress, 
    getDailyProgress 
  } = useTaskStore();
  
  // Get today's progress
  const todayProgress = getDailyProgress(today)?.taskProgress || {};
  
  // Handle task selection
  const handleTaskPress = (taskId: string) => {
    setSelectedTaskId(taskId);
  };
  
  // Handle progress level update
  const handleProgressUpdate = (taskId: string, level: ProgressLevel) => {
    recordProgress(taskId, level);
  };
  
  // Open task form modal for adding a new task
  const handleAddTask = () => {
    setEditingTask({});
    setIsModalVisible(true);
  };
  
  // Open task form modal for editing an existing task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };
  
  // Save task (create or update)
  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask?.id) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalVisible(false);
    setEditingTask(null);
  };
  
  // Close the modal without saving
  const handleCancelTask = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };
  
  // Sorted tasks by order
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Today's Progress</Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyLink}>History</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.circleContainer}>
        <TaskCircle 
          tasks={tasks} 
          progress={todayProgress} 
          onTaskPress={handleTaskPress}
          size={250}
        />
      </View>
      
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Add tasks to get started tracking your daily progress.
          </Text>
          <TouchableOpacity
            style={styles.addTaskButton}
            onPress={handleAddTask}
          >
            <Text style={styles.addTaskButtonText}>Add Tasks</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tasksContainer}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
          <ScrollView style={styles.tasksList}>
            {sortedTasks.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                progress={todayProgress[task.id] || ProgressLevel.NOTHING}
                onProgressUpdate={(level) => handleProgressUpdate(task.id, level)}
                onEdit={() => handleEditTask(task)}
              />
            ))}
          </ScrollView>
          
          {tasks.length < 7 && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddTask}
            >
              <Text style={styles.addButtonText}>+ Add Task</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
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
  historyLink: {
    fontSize: 16,
    color: THEME_COLORS.primary,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: THEME_COLORS.textLight,
    marginBottom: 20,
  },
  addTaskButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addTaskButtonText: {
    color: THEME_COLORS.white,
    fontWeight: 'bold',
  },
  tasksContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLORS.text,
    marginBottom: 10,
  },
  tasksList: {
    flex: 1,
  },
  addButton: {
    backgroundColor: THEME_COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  addButtonText: {
    color: THEME_COLORS.text,
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
});

export default HomeScreen; 