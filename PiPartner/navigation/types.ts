export type RootStackParamList = {
    Welcome: undefined;
    Home: {
        problem?: string;
        image?: string;
        explanation?: string;
        isFromHistory ?: boolean;
    };
    ChatHistory: undefined;
};