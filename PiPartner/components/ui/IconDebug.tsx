import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/Colors';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export default function IconDebug() {
  const [fontLoaded, setFontLoaded] = React.useState<boolean | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function checkFont() {
      try {
        // Test if Ionicons font is loaded
        const isLoaded = await Font.isLoaded('Ionicons');
        setFontLoaded(isLoaded);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error checking fonts');
      }
    }

    checkFont();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Icon Font Debug</Text>
      
      <View style={styles.debugRow}>
        <Text style={styles.label}>Ionicons Loaded:</Text>
        <Text style={styles.value}>
          {fontLoaded === null ? 'Checking...' : fontLoaded ? 'Yes' : 'No'}
        </Text>
      </View>

      {error && (
        <View style={styles.debugRow}>
          <Text style={styles.label}>Error:</Text>
          <Text style={[styles.value, styles.error]}>{error}</Text>
        </View>
      )}

      <View style={styles.debugRow}>
        <Text style={styles.label}>Ionicons Import:</Text>
        <Text style={styles.value}>
          {typeof Ionicons !== 'undefined' ? 'Available' : 'Not available'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.BLACK,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: THEME.PURPLE,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.WHITE,
    marginBottom: 15,
    textAlign: 'center',
  },
  debugRow: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  label: {
    color: THEME.WHITE,
    marginRight: 10,
    fontWeight: 'bold',
    width: 120,
  },
  value: {
    color: THEME.WHITE,
    flex: 1,
  },
  error: {
    color: '#ff6666',
  }
}); 