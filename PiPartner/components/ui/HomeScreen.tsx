import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useChatHistory } from '../../hooks/ChatHistoryContext';
import { StackNavigationProp } from '@react-navigation/stack';
import MathJaxRenderer from ''; //implement
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/Colors';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/types'; 

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
    route: HomeScreenRouteProp;
}

interface ConversationContext {
    originalProblm: {
        text: string;
        image?: string;
    }
    previousResponse: string;
}

export default function HomeScreen({ navigation, route }: HomeScreenProps) {
    const [problem, setProblem] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [requiresConfirmation, setRequiresConfirmation] = useState(false);
    const [extractedProblem, setExtractedProblem] = useState('');
    const { addChatHistory, chatHistory } = useChatHistory();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    
    const [conversationContext, setConversationContext] = useState<ConversationContext | null>(null);
    const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
    const [showCancelOption, setShowCancelOption] = useState(false);
    const abortControllerRef = React.useRef<AbortController | null>(null);

    React.useEffect(() => {
        const loadConversationContext = async () => {
            try { 
                const savedContext = await AsyncStorage.getItem('conversationContext');
                if (savedContext) {
                    console.log("loading saved convesation context");
                    setConversationContext(JSON.parse(savedContext))
                }
            }catch (error) {
                console.log('failed to load conversation context: ', error)
            }
        };

        loadConversationContext();
    }, []);

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