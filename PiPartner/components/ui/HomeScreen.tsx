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
    originalProblem: {
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
                    console.log("loading saved conversation context");
                    setConversationContext(JSON.parse(savedContext))
                }
            }catch (error) {
                console.log('failed to load conversation context: ', error)
            Alert.alert('Error', 'Failed to load previous conversation');
            }
        };

        loadConversationContext();
    }, []);

    const saveConversationContext = async (context: ConversationContext) => {
        try {
            const contextString = JSON.stringify(context);
            await AsyncStorage.setItem('conversationContext', contextString);
            console.log('saved conversation context');
        } catch (error) {
            console.log('failed to save conversation context: ', error)
            Alert.alert('Error', 'Failed to save conversation');
        }
    };

    const clearConversationContext = async () => {
        try {
            await AsyncStorage.removeItem('conversationContext');
            setConversationContext(null);
            console.log('cleared conversation context');
        } catch (error) {
            console.log('failed to clear conversation context: ', error)
            Alert.alert('Error', 'Failed to clear conversation');
        }
    };

    const establishConversationContext = async (problemText: string, problemImage: string | undefined, responseText: string) => {
        const newContext: ConversationContext = {
            originalProblem: {
                text: problemText,
                image: problemImage,
            },
            previousResponse: responseText,
        };

        console.log('establishing conversation context', newContext);
        await setConversationContext(newContext);
    };

    useEffect(() => {
        const processParams = async () => {
            try {
                if (route.params?.image) {
                    setSelectedImage(route.params.image);
                }
                if (route.params?.problem) {
                    setProblem(route.params.problem);
                }
                if (route.params?.explanation && route.params?.isFromHistory) {
                    setResponse(route.params.explanation);

                    establishConversationContext(
                        route.params.problem || "[Image Input", 
                        route.params.image, 
                        route.params.explanation
                    );

                    return;
                }

                if ((route.params?.image || (route.params?.problem && route.params.problem.trim())) &&
                    !route.params?.explanation) {
                    console.log('about to submit with image:', !!route.params?.image);
                    setIsLoading(true);
                    setResponse('');

                    //determine if this is a follow-up quewstion
                    const isFollowUpQuestion = conversationContext !== null;
                    console.log('Is follow up question:', isFollowUpQuestion);

                    //prepare request body with proper input type 
                    let requestBody: any = {
                        //if the inout type is image set the input type to image, or otherwise text
                        input_type: route.params?.image ? 'image' : 'text',
                        problem: route.params?.problem || '',
                    };

                    //if the input type is image, change the request body to include the image data
                    if (route.params?.image) {
                        requestBody = {
                            input_type: 'image',
                            image_data: route.params.image,
                        };
                    }

                    // add coversation context for follow up questions
                    if (isFollowUpQuestion && conversationContext) {
                        requestBody.context = {
                            originalProblem: conversationContext.originalProblem,
                            previousResponse: conversationContext.previousResponse,
                            ifFollowUp: true,
                        }
                        console.log('Includiong follow up context:', requestBody.contex);
                    }
                    //fetch the response from the API
                    console.log('Sending request to API with payload:', JSON.stringify(requestBody).substring(0, 200) + '...');

                    const response = await fetch(
                        'api-key',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestBody),
                        }
                    );

                    //parsing through the response

                    if (response.ok) {
                        const data = await response.json();
                        console.log('API response:', data);

                        let explanation = "";
                        let nestedBody: any = {};

                        if (typeof data === 'object' && data !== null) {
                            if (data.body && typeof data.body === 'string') {
                                try {
                                    nestedBody = JSON.parse(data.body);
                                    explanation = nestedBody.explanation;
                                    console.log('parsed explanation:', explanation);
                                } catch (e) {
                                    console.log('failed to parse body:', e);
                                    explanation = data.body;
                                }
                            } else {
                                nestedBody = data;
                                explanation = data.explanation;
                            }
                        }

                        setResponse(explanation);
                        setExtractedProblem(nestedBody.problem || '');

                        if (explanation) {
                            setResponseAndPrepareForFollowUp(explanation);
                        }

                        setSelectedImage(null);

                        addChatHistory({
                            problem: route.params?.image ? "[Image Input]" : (route.params?.problem || nestedBody.problem || 'N/A'),
                            explanation: explanation,
                            extractedText: route.params?.image ? (nestedBody.ocr_result || '') : undefined,
                            image_data: route.params?.image || undefined,
                            isFollowUp: false // Initial question is not a follow-up
                          });

                        } else {
                            setResponse(`Error: ${response.status} - ${await response.text()}`);
                        }
                    }
                 } catch (error) {
                        console.log("error processing params:", error);
                }
                };

                processParams();
            }, [route.params]);




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
                    <View style={styles.imagePreviewContainer}>
                        <Text style={styles.problem}>Problem: {problem}</Text>
                    </View>
                ): null}

                {selectedImage ? (
                    <View style={styles.imagePreviewContainer}>
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
    imagePreviewContainer: {

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