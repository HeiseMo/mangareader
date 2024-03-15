import React from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './ThemeContext'; // Correctly importing ThemeProvider here
import styles from './Styles.js';

// Components
import MangaListScreen from './components/MangaListScreen';
import MangaDetailScreen from './components/MangaDetailScreen';
import ChapterImagesScreen from './components/ChapterImagesScreen';
import SettingsScreen from './components/SettingsScreen';

const Stack = createNativeStackNavigator();
const screenWidth = Dimensions.get('window').width; // Correctly defining screenWidth

export default function Main() {
    const { theme } = useTheme(); // Correct use of the custom hook to get the current theme
    const dynamicStyles = styles(theme, screenWidth); // Assuming styles is a function that accepts theme and screenWidth

    return (
        // Directly using ThemeProvider here to wrap the NavigationContainer
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={({ navigation }) => ({
                            headerStyle: {
                                backgroundColor: theme === 'light' ? 'white' : 'black',
                            },
                            headerTintColor: theme === 'light' ? 'black' : 'white',
                            headerTitleStyle: {
                                color: theme === 'light' ? 'black' : 'white',
                            },
                            headerRight: () => (
                                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                                    <Ionicons name="settings" size={24} color={theme === 'light' ? 'black' : 'white'} />
                                </TouchableOpacity>
                            ),
                        })}
                    >
                    <Stack.Screen name="MangaList" component={MangaListScreen} options={{ title: 'Manga List' }} />
                    <Stack.Screen name="MangaDetail" component={MangaDetailScreen} options={{ title: 'Manga Detail' }} />
                    <Stack.Screen
                        name="ChapterImages"
                        component={ChapterImagesScreen}
                        options={({ route }) => ({
                            title: route.params.title, // Set the header title dynamically based on the passed title
                        })} 
                    />
                    <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
                </Stack.Navigator>
            </NavigationContainer>
    );
}
