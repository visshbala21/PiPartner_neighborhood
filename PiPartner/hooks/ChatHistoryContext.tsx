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

    useEffect(() => {
        loadChatHistory();
    }, []);
    
    const loadChatHistory = async () => {
        try {
            const history = await AsyncStorage.getItem('chatHistory');
            if (history) {
                setChatHistory(JSON.parse(history));
            }
        }catch (error) {
            console.error('Error loading chat histoty:', error);
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

        try{
            await AsyncStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
        }catch (error) {
            console.error('Error saving chat history:', error);
        }
    };

    const clearChatHistory = async () => {
        setChatHistory([]);
        try {
            await AsyncStorage.removeItem('chatHistory');
        }catch (error) {
            console.error('Error clearing chat history: ', error);
        }
    };

    return(
        <ChatHistoryContext.Provider value={{chatHistory, addChatHistory, clearChatHistory}}>
            {children}
        </ChatHistoryContext.Provider>
    )
}