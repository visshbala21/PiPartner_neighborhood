import React from 'react';
import { ChatHistoryProvider } from "@/hooks/ChatHistoryContext";
import AppNavigator from "@/navigation/AppNavigator";

export default function App(){
    return (
        <ChatHistoryProvider>
            <AppNavigator/>
        </ChatHistoryProvider>
    );
}