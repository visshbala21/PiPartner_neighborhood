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
import Ionicons from '@expo/vector-icons/Ionicons';
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
    const handleImageUpload = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grand cameral roll permissions to upload an image');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4,3],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets[0].base64) {
                setSelectedImage(result.assets[0].base64);
                setProblem('');
                Alert.alert('Sucess', 'Image uploaded sucessfully! tap to submit to continue. ');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image: ' + (error instanceof Error ? error.message : String(error)));
        }
    };

    const navigateToChatHistory = () => {
        setMenuVisible(false);
        navigation.navigate('ChatHistory');
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
                        <Ionicons name="menu" size={24} color={THEME.PURPLE} />
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
                                    <Ionicons name="close" size={16} color={THEME.PURPLE} />
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
                        <Ionicons name="arrow-forward" size={28} color={(query.trim() || selectedImage) ? THEME.PURPLE : '#555'} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Dropdown Menu */}
            {menuVisible && (
                <Animated.View
                style={[
                    styles.menuContainer,
                    { opacity: fadeAnim}
                ]}
                >
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={navigateToChatHistory}
                    >
                        <Ionicons name="time-outline" size={20} color={THEME.PURPLE} />
                        <Text style={styles.menuText}>Chat History</Text>
                    </TouchableOpacity>

                </Animated.View>
            )}                
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.BLACK,
        padding: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: THEME.WHITE,
        textAlign: 'center',
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 50 : 20,
    },
    menuButton: {
        padding: 8,
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        fontSize: 16,
        color: THEME.WHITE,
        padding: 12, 
        textAlign: 'left',
        minHeight: 40,
        textAlignVertical: 'center',
    },
    inputContainer: {
        marginBottom: 40,
        backgroundColor: THEME.DARK_GRAY,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: THEME.BLACK,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: THEME.PURPLE,
        width: '98%',
        alignSelf: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: THEME.MEDIUM_GRAY,
    },
    smallImagePreviewContainer: {
        width: 40, 
        height: 40,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        marginRight: 8,
    },
    smallImagePreview: {
        width: '100%',
        height: '100%',
    },
    removeImageButtonSmall: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 8,
        padding: 2,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
    },
    sendButton: {
        marginLeft: 'auto',
    },
    menuContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 90 : 60,
        right: 16,
        backgroundColor: THEME.DARK_GRAY,
        borderRadius: 8,
        padding: 8,
        minWidth: 150,
        zIndex: 10,
        elevation: 5,
        shadowColor: THEME.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: THEME.PURPLE,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    menuText: {
        color: THEME.PURPLE,
        marginLeft: 10,
        fontSize: 16,
    },
});