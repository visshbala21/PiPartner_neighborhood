import React, { useRef, useState } from 'react';
import { 
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
    StatusBar,
    Animated,
    KeyboardAvoidingView,
    Alert,
    Image,
 } from 'react-native';
import { THEME } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>

interface WelcomeScreenProps {
    navigation: WelcomeScreenNavigationProp;
}



export default function WelcomeScreen({navigation}: WelcomeScreenProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [problem, setProblem] = useState('');
    const [query, setQuery] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;


    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    
    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
        Animated.timing(fadeAnim, {
            toValue: menuVisible ? 0 : 1,
            duration: 200,
            useNativeDriver: true,
        }).start()
    };

    const handleSubmit = () => {
        // Allow submission if either query text or an image is present
        if (query.trim() || selectedImage) {
          navigation.navigate('Home', { 
            problem: query, 
            image: selectedImage 
          });
        }
      };
    const handleImageUpload = () => {

    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <StatusBar barStyle="light-content"/>

                {/*menu button*/}
                <View style={styles.header}>
                    <TouchableOpacity
                    style={styles.menuButton}
                    onPress={toggleMenu}
                    >
                        <Ionicons name="ellipsis-vertical" size={24} color={THEME.PURPLE}/>
                    </TouchableOpacity>
                </View>

                {/*Title*/}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>What can I help with?</Text>
                </View>

                {/*Search Input*/}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Ask me anything..."
                        placeholderTextColor="#666"
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit}
                        autoFocus={false}
                        multiline={true}
                        numberOfLines={1}
                    />

                    <View style={styles.buttonRow}>
                        {/* Image Preview if and only if image is uploaded*/}
                        {selectedImage ? (
                            <View style={styles.smallImagePreviewContainer}>
                                <Image 
                                    source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
                                    style={styles.smallImagePreview}
                                    resizeMode="cover"
                                    />
                                <TouchableOpacity
                                    style={styles.removeImageButtonSmall}
                                    onPress={() => setSelectedImage(null)}
                                >
                                    <Ionicons name="close-circle" size={16} color={THEME.PURPLE} />
                                </TouchableOpacity>
                                </View>
                        ) : (
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={handleImageUpload}
                            >
                                <Ionicons name="add" size={20} color={THEME.PURPLE} />
                          </TouchableOpacity>
                        )}

                    <TouchableOpacity
                        style={[styles.button, styles.sendButton]}
                        onPress={() => {
                            if (query.trim() || selectedImage) {
                                handleSubmit();
                            }
                        }}
                        disabled={!query.trim() && !selectedImage}
                    >
                        <Ionicons
                        name="send"
                        size={28}
                        color={(query.trim() || selectedImage) ? THEME.PURPLE : '#555'}
                        />
                    </TouchableOpacity>
                </View>
            </View>



                
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 50 : 20,
    },
    menuButton: {
        
    },
    titleContainer: {
        
    },
    input: {

    },
    inputContainer: {

    },
    buttonRow: {

    },
    smallImagePreviewContainer: {

    },
    smallImagePreview: {

    },
    removeImageButtonSmall: {
        
    },
    button: {

    },
    sendButton: {
        
    }
});