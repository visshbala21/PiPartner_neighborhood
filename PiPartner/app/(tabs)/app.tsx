import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ChatHistoryProvider } from '../../hooks/ChatHistoryContext';
import WelcomeScreen from '../../components/ui/WelcomeScreen';
import HomeScreen from '../../components/ui/HomeScreen';
import ChatHistoryScreen from '../../components/ui/ChatHistoryScreen';
import { THEME } from '../../constants/Colors';
import { StyleSheet } from 'react-native';
import { RootStackParamList } from '../../navigation/types';

const Stack = createStackNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: THEME.WHITE,
    textAlign: 'left',
    minHeight: 50,
    textAlignVertical: 'center',
  },
});

export default function App() {
  return (
    <ChatHistoryProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: {
              backgroundColor: THEME.BLACK,
              shadowColor: THEME.PURPLE,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: THEME.PURPLE,
            headerTitleStyle: {
              fontWeight: 'bold',
              color: THEME.PURPLE,
            },
            cardStyle: { backgroundColor: THEME.BLACK }
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={({ route }) => ({
              title: 'Solution',
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: THEME.BLACK,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              }
            })}
          />
          <Stack.Screen 
            name="ChatHistory" 
            component={ChatHistoryScreen}
            options={{ 
              title: 'Chat History',
              headerBackTitle: 'Back',
            }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </ChatHistoryProvider>
  );
} 