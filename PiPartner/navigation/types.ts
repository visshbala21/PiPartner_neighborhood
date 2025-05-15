export type RootStackParamList = {
    Welcome: undefined;
    Home: {
        problem?: string;
        image: string | null;
        explanation?: string;
        isFromHistory?: boolean;
    };
    ChatHistory: undefined;
};