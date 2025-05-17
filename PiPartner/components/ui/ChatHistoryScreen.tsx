import React from 'react';
 import { View, Text, StyleSheet, FlatList } from 'react-native';
 import { THEME } from '../../constants/Colors';
 import { useChatHistory } from '../../hooks/ChatHistoryContext';

// Define types for chat history items
interface ChatHistoryItem {
    id: string;
    problem: string;
    timestamp: number;
}
 
 export default function ChatHistoryScreen() {
    const { chatHistory } = useChatHistory();

return (
         <View style={styles.container}>
             <Text style={styles.title}>Chat History</Text>
            {chatHistory.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No chat history yet</Text>
                </View>
            ) : (
                <FlatList
                    data={chatHistory}
                    keyExtractor={(item) => item.id}
                    renderItem={renderHistoryItem}
                    style={styles.list}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                />
            )}
         </View>
     );
 }

// Extract renderItem function to prevent unnecessary re-renders
const renderHistoryItem = ({ item }: { item: ChatHistoryItem }) => (
    <View style={styles.historyItem}>
        <Text style={styles.problemText}>{item.problem}</Text>
        <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.BLACK,
        padding: 16,
    },
    title: {
        fontSize: 24,
        color: THEME.PURPLE,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    list: {
        flex: 1,
    },
    historyItem: {
        backgroundColor: THEME.DARK_GRAY,
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    problemText: {
        color: THEME.WHITE,
        fontSize: 16,
        marginBottom: 4,
    },
    timestamp: {
        color: THEME.MEDIUM_GRAY,
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: THEME.WHITE,
        fontSize: 16,
    },
});