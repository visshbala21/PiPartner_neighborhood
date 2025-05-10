import React from 'react';
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

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to PiPartner</Text>
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
    },
});