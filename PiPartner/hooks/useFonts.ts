import { useCallback, useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

export default function useCustomFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Use useCallback to memoize the function
  const loadFontsAsync = useCallback(async () => {
    try {
      // Try loading with a timeout to avoid hanging
      const fontPromise = Font.loadAsync(Ionicons.font);
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          console.log('Font loading timed out, continuing anyway');
          resolve(false);
        }, 3000);
      });
      
      const result = await Promise.race([fontPromise, timeoutPromise]);
      
      if (result !== false) {
        console.log('Ionicons font loaded successfully');
      }
      
      setFontsLoaded(true);
    } catch (error) {
      console.warn('Error loading fonts:', error);
      // Set to true anyway to not block the app
      setFontsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFontsAsync();
  }, [loadFontsAsync]);

  return { fontsLoaded };
} 