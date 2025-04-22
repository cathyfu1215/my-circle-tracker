import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task, ProgressLevel } from '../store/taskStore';
import { PROGRESS_LEVEL_COLORS, THEME_COLORS } from '../constants/colors';

interface TaskListItemProps {
  task: Task;
  progress: ProgressLevel;
  onProgressUpdate: (level: ProgressLevel) => void;
  onEdit: () => void;
}

// Labels for progress buttons
const PROGRESS_LABELS = {
  [ProgressLevel.NOTHING]: 'Nothing',
  [ProgressLevel.MINIMAL]: 'Minimal',
  [ProgressLevel.TARGET]: 'Target',
  [ProgressLevel.BEYOND_TARGET]: 'Beyond',
};

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  progress,
  onProgressUpdate,
  onEdit,
}) => {
  const getProgressColor = (level: ProgressLevel): string => {
    switch (level) {
      case ProgressLevel.NOTHING:
        return PROGRESS_LEVEL_COLORS.NOTHING;
      case ProgressLevel.MINIMAL:
        return PROGRESS_LEVEL_COLORS.MINIMAL(task.color);
      case ProgressLevel.TARGET:
        return PROGRESS_LEVEL_COLORS.TARGET(task.color);
      case ProgressLevel.BEYOND_TARGET:
        return PROGRESS_LEVEL_COLORS.BEYOND_TARGET(task.color);
      default:
        return PROGRESS_LEVEL_COLORS.NOTHING;
    }
  };

  // Cycle through progress levels when the main task item is tapped
  const handleTaskPress = () => {
    const nextLevel = (progress + 1) % 4;
    onProgressUpdate(nextLevel);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.taskInfoContainer}
        onPress={handleTaskPress}
        onLongPress={onEdit}
      >
        <View style={[styles.colorIndicator, { backgroundColor: task.color }]} />
        <Text style={styles.taskName}>{task.name}</Text>
      </TouchableOpacity>
      
      <View style={styles.progressButtons}>
        {Object.keys(PROGRESS_LABELS).map((level) => {
          const progressLevel = parseInt(level, 10) as ProgressLevel;
          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.progressButton,
                { backgroundColor: getProgressColor(progressLevel) },
                progress === progressLevel && styles.selectedProgressButton,
              ]}
              onPress={() => onProgressUpdate(progressLevel)}
            >
              <Text 
                style={[
                  styles.progressText,
                  progressLevel === ProgressLevel.NOTHING && styles.darkText,
                ]}
              >
                {PROGRESS_LABELS[progressLevel][0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.white,
    borderRadius: 8,
    marginVertical: 5,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
  },
  progressButtons: {
    flexDirection: 'row',
  },
  progressButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedProgressButton: {
    borderWidth: 2,
    borderColor: THEME_COLORS.text,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME_COLORS.white,
  },
  darkText: {
    color: THEME_COLORS.text,
  },
});

export default TaskListItem; 