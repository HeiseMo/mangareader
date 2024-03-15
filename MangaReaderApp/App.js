import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from './ThemeContext'; // Adjust the import path according to your project structure

//Components
import MangaListScreen from './components/MangaListScreen';
import MangaDetailScreen from './components/MangaDetailScreen';
import ChapterImagesScreen from './components/ChapterImagesScreen';
import SettingsScreen from './components/SettingsScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {

    return (
    <ThemeProvider>
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={({ navigation }) => ({
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                            <Ionicons name="settings" size={24} color='black' />
                        </TouchableOpacity>
                    ),
                })}
            >
                <Stack.Screen name="MangaList" component={MangaListScreen} options={{ title: 'Manga List' }} />
                <Stack.Screen name="MangaDetail" component={MangaDetailScreen} options={{ title: 'Manga Detail' }} />
                <Stack.Screen name="ChapterImages" component={ChapterImagesScreen} options={{ title: 'Chapter Images' }} />
                <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
            </Stack.Navigator>
        </NavigationContainer>
        </ThemeProvider>
    );
}

