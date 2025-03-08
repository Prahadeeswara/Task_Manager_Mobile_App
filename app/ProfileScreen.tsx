import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>👤 Profile</Text>
      <Text style={styles.text}>Name: Your Name</Text>
      <Text style={styles.text}>Email: your@email.com</Text>
      <Text style={styles.text}>Tasks Completed: 10</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 18, marginBottom: 5 },
});
