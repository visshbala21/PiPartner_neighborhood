import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatHistoryScreen from '../screens/ChatHistoryScreen';
import { THEME } from '../theme';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: THEME.BLACK,
                        shadowColor: THEME.PURPLE,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0
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
    );
}

