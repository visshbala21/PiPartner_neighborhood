import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatHistoryItem {
    id: string;
    problem: string;
    timestamp: number;
    image?: string;
}

interface ChatHistoryContextType {
    chatHistory: ChatHistoryItem[];
    addChatHistory: (item: Omit<ChatHistoryItem, 'id' | 'timestamp'>) => void;
    clearChatHistory: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export const useChatHistory = () => {
    const context = useContext(ChatHistoryContext);
    if (!context) {
        throw new Error('useChatHistory must be used within a ChatHistoryProvide');
    }
    return context;
};

export const ChatHistoryProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
    const [storageAvailable, setStorageAvailable] = useState(true);

    useEffect(() => {
        checkStorageAndLoadHistory();
    }, []);
    
    const checkStorageAndLoadHistory = async () => {
        try {
            // Test if AsyncStorage is available
            await AsyncStorage.setItem('storage_test', 'test');
            await AsyncStorage.removeItem('storage_test');
            
            // If we got here, AsyncStorage is working
            loadChatHistory();
        } catch (error) {
            console.warn('AsyncStorage not available:', error);
            setStorageAvailable(false);
        }
    };
    
    const loadChatHistory = async () => {
        try {
            const history = await AsyncStorage.getItem('chatHistory');
            if (history) {
                setChatHistory(JSON.parse(history));
            }
        } catch (error) {
            console.warn('Error loading chat history:', error);
        }
    };

    const addChatHistory = async (item: Omit<ChatHistoryItem, 'id' | 'timestamp'>) => {
        const newItem: ChatHistoryItem = {
            ...item,
            id: Date.now().toString(),
            timestamp: Date.now(),
        };

        const updatedHistory = [newItem, ...chatHistory];
        setChatHistory(updatedHistory);

        if (storageAvailable) {
            try {
                await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
            } catch (error) {
                console.warn('Error saving chat history:', error);
                setStorageAvailable(false);
            }
        }
    };

    const clearChatHistory = async () => {
        setChatHistory([]);
        if (storageAvailable) {
            try {
                await AsyncStorage.removeItem('chatHistory');
            } catch (error) {
                console.warn('Error clearing chat history:', error);
                setStorageAvailable(false);
            }
        }
    };

    return(
        <ChatHistoryContext.Provider value={{chatHistory, addChatHistory, clearChatHistory}}>
            {children}
        </ChatHistoryContext.Provider>
    );
}