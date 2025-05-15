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
  Modal,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useChatHistory } from '../../hooks/ChatHistoryContext';
import { StackNavigationProp } from '@react-navigation/stack';
import MathJaxRenderer from '../../app/(tabs)/MathJaxRenderer'; //implement
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../constants/Colors';
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
       <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64: 0}
        >
            <TouchableOpacity
                style={styles.clockButton}
                onPress={() => navigation.navigate('ChatHistory')}
                disabled={isLoading}
            >
                <Ionicons name="time-outline" size={28} color={THEME.PURPLE} />
            </TouchableOpacity>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            >
                {problem && !selectedImage ? (
                    <View style={styles.imagePreiewContainer}>
                        <Text style={styles.problem}>Problem: {problem}</Text>
                    </View>
                ): null}

                {selectedImage ? (
                    <View style={styles.imagePreiewContainer}>
                        <Image 
                            source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
                            style={styles.imagePreview}
                            resizeMode="contain"
                        />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => setSelectedImage(null)}
                        >
                            <Ionicons name="close-circle" size={24} color={THEME.PURPLE}/>
                        </TouchableOpacity>
                    </View>
                ) : null} 

                {response ? (
                    <View style={styles.responseCard}>
                        <MathJaxRenderer
                            content={response}
                            style={styles.mathRenderer}
                        />
                    </View>
                ): null}

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={THEME.PURPLE}/>
                    </View>
                )}
            </ScrollView>

        </KeyboardAvoidingView>
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
    clockButton: {

    },
    scrollView: {

    },
    imagePreiewContainer: {

    },
    problem: {

    },
    imagePreview: {

    },
    removeImageButton: {
        
    },
    responseCard: {

    },
    mathRenderer: {

    },
    loadingContainer: {

    }
});