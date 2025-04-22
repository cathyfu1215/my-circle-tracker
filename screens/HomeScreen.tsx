import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TaskCircle from '../components/TaskCircle';
import { useTaskStore, ProgressLevel } from '../store/taskStore';
import { THEME_COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const ProgressButton = ({ 
  label, 
  isSelected, 
  onPress 
}: { 
  label: string; 
  isSelected: boolean; 
  onPress: () => void 
}) => (
  <TouchableOpacity
    style={[
      styles.progressButton,
      isSelected && { backgroundColor: THEME_COLORS.primary }
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.progressButtonText,
        isSelected && { color: THEME_COLORS.white }
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Get today's date in ISO format (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);
  
  // Access store data
  const { 
    tasks, 
    recordProgress, 
    getDailyProgress 
  } = useTaskStore();
  
  // Get today's progress
  const todayProgress = getDailyProgress(today)?.taskProgress || {};
  
  // Handle task selection
  const handleTaskPress = (taskId: string) => {
    setSelectedTaskId(taskId);
  };
  
  // Handle progress level selection
  const handleProgressChange = (level: ProgressLevel) => {
    if (selectedTaskId) {
      recordProgress(selectedTaskId, level);
    }
  };
  
  // Find selected task
  const selectedTask = selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null;
  
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
      
      {tasks.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Add tasks to get started tracking your daily progress.
          </Text>
          <TouchableOpacity
            style={styles.addTaskButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.addTaskButtonText}>Add Tasks</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {selectedTask && (
        <View style={styles.taskControls}>
          <Text style={styles.selectedTaskTitle}>{selectedTask.name}</Text>
          
          <View style={styles.progressButtons}>
            <ProgressButton
              label="Nothing"
              isSelected={todayProgress[selectedTaskId] === ProgressLevel.NOTHING}
              onPress={() => handleProgressChange(ProgressLevel.NOTHING)}
            />
            <ProgressButton
              label="Minimal"
              isSelected={todayProgress[selectedTaskId] === ProgressLevel.MINIMAL}
              onPress={() => handleProgressChange(ProgressLevel.MINIMAL)}
            />
            <ProgressButton
              label="Target"
              isSelected={todayProgress[selectedTaskId] === ProgressLevel.TARGET}
              onPress={() => handleProgressChange(ProgressLevel.TARGET)}
            />
            <ProgressButton
              label="Beyond"
              isSelected={todayProgress[selectedTaskId] === ProgressLevel.BEYOND_TARGET}
              onPress={() => handleProgressChange(ProgressLevel.BEYOND_TARGET)}
            />
          </View>
        </View>
      )}
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 20,
    marginBottom: 30,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
  taskControls: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTaskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  progressButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: THEME_COLORS.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
    alignItems: 'center',
  },
  progressButtonText: {
    fontSize: 12,
    color: THEME_COLORS.text,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: THEME_COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  settingsButtonText: {
    color: THEME_COLORS.text,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 