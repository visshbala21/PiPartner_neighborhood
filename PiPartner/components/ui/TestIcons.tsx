import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { THEME } from '../../constants/Colors';

export default function TestIcons() {
  // Test with several different icons to ensure multiple are working
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Icon Test</Text>
      
      <View style={styles.iconRow}>
        <Text style={styles.label}>Menu Icon:</Text>
        <Ionicons name="menu" size={24} color={THEME.PURPLE} />
      </View>
      
      <View style={styles.iconRow}>
        <Text style={styles.label}>Close Icon:</Text>
        <Ionicons name="close" size={24} color={THEME.PURPLE} />
      </View>
      
      <View style={styles.iconRow}>
        <Text style={styles.label}>Add Icon:</Text>
        <Ionicons name="add" size={24} color={THEME.PURPLE} />
      </View>
      
      <View style={styles.iconRow}>
        <Text style={styles.label}>Arrow Forward:</Text>
        <Ionicons name="arrow-forward" size={24} color={THEME.PURPLE} />
      </View>
      
      <View style={styles.iconRow}>
        <Text style={styles.label}>Time Outline:</Text>
        <Ionicons name="time-outline" size={24} color={THEME.PURPLE} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.BLACK,
    padding: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.WHITE,
    marginBottom: 20,
    textAlign: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    color: THEME.WHITE,
    marginRight: 10,
    fontSize: 16,
    width: 120,
  },
}); 