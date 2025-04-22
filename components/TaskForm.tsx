import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Task } from '../store/taskStore';
import ColorPicker from './ColorPicker';
import { TASK_COLORS, THEME_COLORS } from '../constants/colors';

interface TaskFormProps {
  initialTask?: Partial<Task>;
  onSave: (task: Omit<Task, 'id'>) => void;
  onCancel: () => void;
  existingTaskCount: number;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialTask = { name: '', color: TASK_COLORS[0], order: 0 },
  onSave,
  onCancel,
  existingTaskCount,
}) => {
  const [name, setName] = useState(initialTask.name || '');
  const [color, setColor] = useState(initialTask.color || TASK_COLORS[0]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    // If we're at the maximum of 7 tasks and this is a new task, show an error
    if (existingTaskCount >= 7 && !initialTask.id) {
      Alert.alert('Error', 'Maximum of 7 tasks reached');
      return;
    }

    onSave({
      name: name.trim(),
      color,
      order: initialTask.order !== undefined ? initialTask.order : existingTaskCount,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter task name"
      />

      <Text style={styles.label}>Task Color</Text>
      <ColorPicker selectedColor={color} onColorSelect={setColor} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: THEME_COLORS.text,
  },
  input: {
    backgroundColor: THEME_COLORS.background,
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: THEME_COLORS.border,
  },
  cancelButtonText: {
    color: THEME_COLORS.text,
  },
  saveButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: THEME_COLORS.white,
    fontWeight: 'bold',
  },
});

export default TaskForm; 