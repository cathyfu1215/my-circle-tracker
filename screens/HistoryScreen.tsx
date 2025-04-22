import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { useTaskStore, DailyProgress } from '../store/taskStore';
import TaskCircle from '../components/TaskCircle';
import { THEME_COLORS } from '../constants/colors';
import { formatDate, isToday, getLastNDays } from '../utils/dateUtils';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'History'>;

const HistoryScreen = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const { tasks, dailyProgress } = useTaskStore();
  
  // Get dates from the past week (including today)
  const weekDates = getLastNDays(7);
  
  // Get progress for a specific date
  const getProgressForDate = (date: string) => {
    return dailyProgress.find((p: DailyProgress) => p.date === date)?.taskProgress || {};
  };
  
  const renderDateItem = ({ item: date }: { item: string }) => {
    const progress = getProgressForDate(date);
    const formattedDate = formatDate(date);
    
    return (
      <View style={styles.dateItem}>
        <Text style={[
          styles.dateText,
          isToday(date) && styles.todayText
        ]}>
          {isToday(date) ? 'Today' : formattedDate}
        </Text>
        
        <View style={styles.circleContainer}>
          <TaskCircle 
            tasks={tasks} 
            progress={progress} 
            size={120}
          />
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Last 7 Days</Text>
        
        <FlatList
          data={weekDates}
          renderItem={renderDateItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
        />
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
  backLink: {
    fontSize: 16,
    color: THEME_COLORS.primary,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLORS.text,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  dateItem: {
    backgroundColor: THEME_COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME_COLORS.text,
    marginBottom: 10,
  },
  todayText: {
    color: THEME_COLORS.primary,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});

export default HistoryScreen; 