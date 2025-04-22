import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Task } from '../store/taskStore';
import { ProgressLevel } from '../store/taskStore';
import { PROGRESS_LEVEL_COLORS } from '../constants/colors';

interface TaskCircleProps {
  tasks: Task[];
  progress: { [taskId: string]: ProgressLevel };
  onTaskPress?: (taskId: string) => void;
  size?: number;
}

export const TaskCircle: React.FC<TaskCircleProps> = ({
  tasks,
  progress,
  onTaskPress,
  size = 200,
}) => {
  // Sort tasks by order
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
  
  // Calculate angles for each slice
  const sliceCount = sortedTasks.length || 1; // Avoid division by zero
  const sliceAngle = (2 * Math.PI) / sliceCount;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {sortedTasks.map((task, index) => {
          // Calculate the start and end angles for this slice
          const startAngle = index * sliceAngle;
          const endAngle = (index + 1) * sliceAngle;
          
          // Determine color based on progress level
          const progressLevel = progress[task.id] || ProgressLevel.NOTHING;
          let fillColor: string;
          
          switch (progressLevel) {
            case ProgressLevel.NOTHING:
              fillColor = PROGRESS_LEVEL_COLORS.NOTHING;
              break;
            case ProgressLevel.MINIMAL:
              fillColor = PROGRESS_LEVEL_COLORS.MINIMAL(task.color);
              break;
            case ProgressLevel.TARGET:
              fillColor = PROGRESS_LEVEL_COLORS.TARGET(task.color);
              break;
            case ProgressLevel.BEYOND_TARGET:
              fillColor = PROGRESS_LEVEL_COLORS.BEYOND_TARGET(task.color);
              break;
            default:
              fillColor = PROGRESS_LEVEL_COLORS.NOTHING;
          }
          
          // Calculate the path for this slice
          const centerX = size / 2;
          const centerY = size / 2;
          const radius = size / 2;
          
          // Calculate the coordinates
          const x1 = centerX + radius * Math.cos(startAngle);
          const y1 = centerY + radius * Math.sin(startAngle);
          const x2 = centerX + radius * Math.cos(endAngle);
          const y2 = centerY + radius * Math.sin(endAngle);
          
          // Create the arc path
          const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
          const path = `
            M ${centerX} ${centerY}
            L ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
            Z
          `;
          
          return (
            <Pressable 
              key={task.id}
              onPress={() => onTaskPress && onTaskPress(task.id)}
            >
              <Path
                d={path}
                fill={fillColor}
                stroke="#FFFFFF"
                strokeWidth={1}
              />
            </Pressable>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TaskCircle; 