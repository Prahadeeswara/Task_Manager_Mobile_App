import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState('Medium');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadTasks();
    loadTheme();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) setTasks(JSON.parse(storedTasks));
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (tasksToSave) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) setDarkMode(JSON.parse(savedTheme));
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const saveTheme = async (isDarkMode) => {
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    saveTheme(newMode);
  };

  const addTask = () => {
    if (task.trim() !== '') {
      const newTask = { id: Date.now().toString(), text: task, completed: false, priority };
      const newTasks = [...tasks, newTask].sort(sortByPriority);
      setTasks(newTasks);
      saveTasks(newTasks);
      setTask('');
    }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
    saveTasks(filteredTasks);
  };

  const sortByPriority = (a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  };

  const getTaskBackgroundColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ff6b6b'; // Red
      case 'Medium':
        return '#ffa500'; // Orange
      case 'Low':
        return '#32cd32'; // Green
      default:
        return '#eee';
    }
  };

  return (
    <View style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.heading, darkMode ? styles.darkText : styles.lightText]}>Task Manager👨🏻‍💼</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      {/* Input Field */}
      <TextInput
        style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Enter a task..."
        placeholderTextColor={darkMode ? "#bbb" : "#333"}
        value={task}
        onChangeText={(text) => setTask(text)}
      />

      {/* Priority Selection */}
      <View style={styles.priorityContainer}>
        {['High', 'Medium', 'Low'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.priorityButton,
              priority === level && styles.selectedPriority,
              darkMode && styles.darkPriorityButton // Change background color in dark mode
            ]}
            onPress={() => setPriority(level)}
          >
            <Text style={[styles.priorityText, darkMode && styles.darkPriorityText]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Task Button */}
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.taskItem,
            { backgroundColor: getTaskBackgroundColor(item.priority) } // Change Task Background Color Based on Priority
          ]}>
            <TouchableOpacity onPress={() => toggleTask(item.id)}>
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.taskCompleted,
                  darkMode && styles.darkTaskText // ✅ Task text turns white in dark mode
                ]}
              >
                {item.text} ({item.priority})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButton}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  darkContainer: { backgroundColor: '#121212' },
  lightContainer: { backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heading: { fontSize: 24, fontWeight: 'bold' },
  darkText: { color: 'white' },
  lightText: { color: 'black' },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10 },
  darkInput: { backgroundColor: '#333', color: 'white' },
  lightInput: { backgroundColor: 'white', color: 'black' },
  addButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  deleteButton: { fontSize: 18, color: 'red' },
  taskItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginVertical: 5, borderRadius: 10 },
  taskText: { fontSize: 16 },
  darkTaskText: { color: 'white' }, // ✅ Task text turns white in dark mode
  taskCompleted: { textDecorationLine: 'line-through', color: 'gray' },
  priorityContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  priorityButton: { padding: 8, borderRadius: 5, borderWidth: 1 },
  darkPriorityButton: { backgroundColor: '#555' }, // Dark mode background for priority buttons
  selectedPriority: { backgroundColor: '#007bff', borderColor: '#007bff' },
  priorityText: { fontWeight: 'bold', color: 'black' },
  darkPriorityText: { color: 'white' }, // ✅ Change priority button text to white in dark mode
});
