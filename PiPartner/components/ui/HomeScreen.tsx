import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/Colors';
import { useChatHistory } from '../../hooks/ChatHistoryContext';

export default function HomeScreen() {
    const { chatHistory } = useChatHistory();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <Text style={styles.subtitle}>Chat History Items: {chatHistory.length}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.BLACK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        color: THEME.PURPLE,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: THEME.WHITE,
    },
});