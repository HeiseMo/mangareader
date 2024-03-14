import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { parseString } from 'react-native-xml2js';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark as faBookmarkSolid, faStar, faShareAlt, faCheckCircle, faCircle, } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { ThemeProvider } from './ThemeContext'; // Adjust the import path according to your project structure
import { useTheme } from './ThemeContext'; // Adjust the path as necessary

import SettingsScreen from './SettingsScreen';
import styles from './Styles.js';

const BASE_URL = 'https://ftgglin3.oasis.usbx.me'; // Replace with your base URL
const Stack = createNativeStackNavigator();
const screenWidth = Dimensions.get('window').width;

function MangaListScreen({ navigation }) {
    const { theme } = useTheme(); // Use your custom hook to get the current theme
    const dynamicStyles = styles(theme, screenWidth);
    const [mangaList, setMangaList] = useState([]);



    useEffect(() => {
        fetchManga();
    }, []);

    const fetchManga = () => {
        axios.get(`${BASE_URL}/kavita/api/opds/fa66341c-d3a3-432b-bcb1-d83593ca8103/libraries/1`)
            .then(response => {
                parseString(response.data, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }
                    const entries = result.feed.entry;
                    const formattedManga = entries.map(entry => ({
                        id: entry.id[0],
                        title: entry.title[0],
                        thumbnail: entry.link.find(link => link.$.rel.includes('thumbnail')).$.href,
                    }));
                    setMangaList(formattedManga);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    return (
        <ScrollView style={dynamicStyles.mangaListContainer}>
            {mangaList.map((manga) => (
                <TouchableOpacity
                key={manga.id}
                style={dynamicStyles.mangaListItem}
                onPress={() => navigation.navigate('MangaDetail', { manga })}
                activeOpacity={0.7}
                >
                <Image
                    source={{ uri: `${BASE_URL}${manga.thumbnail}` }}
                    style={dynamicStyles.mangaListThumbnail}
                />
                <Text style={dynamicStyles.mangaListTitle}>{manga.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

function ChapterImagesScreen({ route }) {
    const { chapterId, mangaId } = route.params;
    const [imageUrls, setImageUrls] = useState([]);
    const [imageHeights, setImageHeights] = useState({});
    const { theme } = useTheme(); // Use your custom hook to get the current theme
    const dynamicStyles = styles(theme, screenWidth);

    const scrollViewRef = useRef(); // Reference to ScrollView for programmatically scrolling (if needed)

    useEffect(() => {
        const setChapterInProgressIfNeeded = async () => {
            try {
                const progressData = await AsyncStorage.getItem('readingProgress');
                let progress = progressData ? JSON.parse(progressData) : {};
    
                if (progress[chapterId] !== 'completed') {
                    progress[chapterId] = 'inProgress';
                    await AsyncStorage.setItem('readingProgress', JSON.stringify(progress));
                }
            } catch (error) {
                console.error('Error setting chapter to inProgress:', error);
            }
        };
    
        fetchChapterImages(chapterId, mangaId);
        setChapterInProgressIfNeeded();
    }, [chapterId, mangaId]);

    const markChapterAsCompleted = async () => {
        await updateChapterState(chapterId, 'completed');
    };

    const handleScroll = ({ nativeEvent }) => {
        console.log("Scrolling");
        console.log(`Content offset: ${nativeEvent.contentOffset.y}`);
        console.log(`View height: ${nativeEvent.layoutMeasurement.height}`);
        console.log(`Content size: ${nativeEvent.contentSize.height}`);
        console.log(`Is close to bottom: ${isCloseToBottom(nativeEvent)}`);
    
        if (isCloseToBottom(nativeEvent)) {
            markChapterAsCompleted();
        }
    };

    const updateChapterState = async (chapterId, state) => {
        try {
            const progressData = await AsyncStorage.getItem('readingProgress');
            let progress = progressData ? JSON.parse(progressData) : {};
            progress[chapterId] = state;
            await AsyncStorage.setItem('readingProgress', JSON.stringify(progress));
        } catch (error) {
            console.error('Error updating chapter state:', error);
        }
    };

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const threshold = 50; // Adjust this threshold
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - threshold;
    };
    
    const handleImageLoaded = (index, event) => {
        const { width, height } = event.nativeEvent.source;
        const scaleFactor = width / screenWidth;
        const imageHeight = height / scaleFactor;
        setImageHeights(prevHeights => ({ ...prevHeights, [index]: imageHeight }));
    };

    const fetchChapterImages = (chapterId, mangaId) => {
        axios.get(`${BASE_URL}/kavita/api/opds/fa66341c-d3a3-432b-bcb1-d83593ca8103/series/${mangaId}/volume/8/chapter/${chapterId}`)
            .then((response) => {
                parseString(response.data, { explicitArray: false, mergeAttrs: true }, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }
    
                    // Assuming result.feed.entry is directly accessible and correctly parsed
                    const entry = result.feed.entry;
                    if (!entry) {
                        console.error('No entry found in the response:', result);
                        return;
                    }
    
                    // Look for the specific link with streaming information
                    const streamLink = entry.link.find(link => link.rel === "http://vaemendis.net/opds-pse/stream" && link.type === "image/jpeg");
    
                    if (!streamLink) {
                        console.error('Expected stream link not found. Available links:', entry.link);
                        return;
                    }
    
                    // Parse the pageCount and generate image URLs
                    const pageCount = parseInt(streamLink["p5:count"], 10);
                    const urlTemplate = `${BASE_URL}${streamLink.href}`;
                    const imageUrls = Array.from({ length: pageCount }, (_, i) =>
                        urlTemplate.replace('{pageNumber}', i)
                    );
    
                    setImageUrls(imageUrls);
                });
            })
            .catch((error) => {
                console.error('Error fetching chapter images:', error);
            });
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            style={dynamicStyles.scrollView}
            onScroll={handleScroll}
            scrollEventThrottle={400} // Adjust based on performance
        >
            <View style={dynamicStyles.imageContainer}>
                {imageUrls.map((url, index) => (
                    <Image
                        key={index}
                        source={{ uri: url }} 
                        style={[dynamicStyles.chapterImage, { height: imageHeights[index] || 200 }]}
                        onLoad={event => handleImageLoaded(index, event)}
                    />
                ))}
            </View>
        </ScrollView>
    );
}

function MangaDetailScreen({ route, navigation }) {
    const { manga } = route.params;
    const [chapters, setChapters] = useState([]);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [readingProgress, setReadingProgress] = useState({});
    const { theme } = useTheme(); // Use your custom hook to get the current theme
    const dynamicStyles = styles(theme, screenWidth);

    useEffect(() => {
          fetchChapters();
          checkBookmarkStatus();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchReadingProgress();
        }, [])
    );

    const fetchChapters = () => {
        axios.get(`${BASE_URL}/kavita/api/opds/fa66341c-d3a3-432b-bcb1-d83593ca8103/series/${manga.id}`)
            .then(response => {
                parseString(response.data, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }
                    if (result.feed && result.feed.entry) {
                        const chapterEntries = result.feed.entry;
                        const formattedChapters = chapterEntries.map(entry => ({
                            id: entry.id[0],
                            title: entry.title[0],
                            // Add other chapter details you need here
                        }));
                        setChapters(formattedChapters);
                    } else {
                        setChapters([]);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching chapters:', error);
            });
    };

    const fetchReadingProgress = async () => {
        try {
        const progressData = await AsyncStorage.getItem('readingProgress');
        setReadingProgress(progressData ? JSON.parse(progressData) : {});
        } catch (error) {
        console.error('Failed to fetch reading progress:', error);
        }
    };

  const checkBookmarkStatus = async () => {
        try {
        const bookmarkedMangas = await AsyncStorage.getItem('bookmarkedMangas');
        const bookmarks = bookmarkedMangas ? JSON.parse(bookmarkedMangas) : [];
        setIsBookmarked(bookmarks.some(bookmark => bookmark.id === manga.id));
        } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
        }
    };

    const toggleBookmark = async () => {
        try {
        const bookmarkedMangas = await AsyncStorage.getItem('bookmarkedMangas');
        let bookmarks = bookmarkedMangas ? JSON.parse(bookmarkedMangas) : [];
        if (isBookmarked) {
            bookmarks = bookmarks.filter(bookmark => bookmark.id !== manga.id);
        } else {
            bookmarks.push({ id: manga.id, title: manga.title });
        }
        await AsyncStorage.setItem('bookmarkedMangas', JSON.stringify(bookmarks));
        setIsBookmarked(!isBookmarked);
        } catch (error) {
        console.error('Failed to update bookmarks:', error);
        }
    };

  return (
    <ScrollView style={dynamicStyles.container}>
        <View style={dynamicStyles.mangaDetailsContainer}>
        <View style={dynamicStyles.mangaImageWrapper}>
            <Image source={{ uri: `${BASE_URL}${manga.thumbnail}` }} style={dynamicStyles.mangaThumbnail} />
            <TouchableOpacity onPress={toggleBookmark} style={dynamicStyles.bookmarkIconStyle}>
            <FontAwesomeIcon icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular} size={24} />
            </TouchableOpacity>
        </View>
        <Text style={dynamicStyles.mangaTitleStyle}>{manga.title}</Text>
        <ScrollView style={dynamicStyles.mangaChaptersScroll}>
            {chapters.map((chapter, index) => (
            <TouchableOpacity
                key={index}
                style={dynamicStyles.mangaChapterItem}
                onPress={() => navigation.navigate('ChapterImages', { chapterId: chapter.id, mangaId: manga.id })}
            >
                <Text style={dynamicStyles.chapterTitleStyle}>{chapter.title}</Text>
                {readingProgress[chapter.id] === 'inProgress' && (
                <FontAwesomeIcon icon={faCircle} size={24} color="gold" />
                )}
                {readingProgress[chapter.id] === 'completed' && (
                <FontAwesomeIcon icon={faCheckCircle} size={24} color="#4CAF50" />
                )}
            </TouchableOpacity>
            ))}
        </ScrollView>
        </View>

    </ScrollView>
  );
}

export default function App() {

    return (
    <ThemeProvider>    
        <NavigationContainer>
            <Stack.Navigator                 
                screenOptions={({ navigation }) => ({
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                            <Ionicons name="settings" size={24} color="black" />
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

