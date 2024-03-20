import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, TouchableOpacity, Image, Text, FlatList, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseString } from 'react-native-xml2js';
import { useTheme } from '../ThemeContext'; 
import styles from '../Styles.js';
import { BASE_URL } from '../constants'; 
import ChapterNavigationShadowBox from './ChapterNavigationShadowBox';
global.Buffer = global.Buffer || require('buffer').Buffer;
import { AUTH_TOKEN, API_KEY } from '@env';

const screenWidth = Dimensions.get('window').width;

function ChapterImagesScreen({ route }) {
    const navigation = useNavigation(); // Hook to get access to the navigation object
    const { chapterId, mangaId, pages, chapters, title } = route.params;
    const [imageUrls, setImageUrls] = useState([]);
    const [imageHeights, setImageHeights] = useState({});
    const [prevChapterId, setPrevChapterId] = useState(null);
    const [nextChapterId, setNextChapterId] = useState(null);
    const { theme } = useTheme(); 
    const dynamicStyles = styles(theme, screenWidth);
    const scrollViewRef = useRef(); // Reference to ScrollView for programmatically scrolling (if needed)
    const [loading, setLoading] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    

    const api = axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: AUTH_TOKEN,
        }
    });

    const apiFetch = async () => {
        const fetchPage = async (page) => {
            try {
                const url = `kavita/api/Reader/image?chapterId=${chapterId}&page=${page}&apiKey=${API_KEY}`;
                const response = await api.get(url, { responseType: 'arraybuffer' });
    
                if (response && response.data) {
                    const binaryData = response.data;
                    const base64Image = Buffer.from(binaryData).toString('base64');
                    const imageUri = `data:image/jpeg;base64,${base64Image}`;
                    return imageUri; // Return the image URI
                } else {
                    console.error(`Error fetching image for page ${page}`);
                    return null; // Return null if there's an error or no response data
                }
            } catch (error) {
                console.error(`Error fetching image for page ${page}:`, error);
                return null; // Return null on error
            }
        };
    
        const promises = [];
        for (let page = 0; page < pages; page++) {
            promises.push(fetchPage(page));
        }
    
        const imageUris = await Promise.all(promises);
    
        const validImageUris = imageUris.filter(uri => uri !== null);
    
        setImageUrls(validImageUris); 
    };
    

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

        apiFetch();
        setChapterInProgressIfNeeded();
        
    }, [chapterId, mangaId]);

    useEffect(() => {
        if (chapters) {
          const currentIndex = chapters.findIndex(ch => ch.id === chapterId.toString());

          const prevChapterId = currentIndex > 0 ? chapters[currentIndex - 1].id : null;
          const nextChapterId = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1].id : null;
          console.log(nextChapterId, "next");
          setPrevChapterId(prevChapterId);
          setNextChapterId(nextChapterId);
        } else {
          console.log('Chapters not defined');
        }
      }, [chapterId, chapters]);

      useEffect(() => {
        if (scrollViewRef.current && imageUrls.length > 0) {
            // This assumes imageUrls is populated once the new chapter's images are loaded
            scrollViewRef.current.scrollToOffset({ animated: true, offset: 0 });
        }
    }, [imageUrls]);

    const markChapterAsCompleted = async () => {
        await updateChapterState(chapterId, 'completed');
    };

    const updateChapterState = async (chapterId, state) => {
        try {
            console.log(`Updating chapter state for ${chapterId} to ${state}`);
            const progressData = await AsyncStorage.getItem('readingProgress');
            let progress = progressData ? JSON.parse(progressData) : {};
            progress[chapterId] = state;
            await AsyncStorage.setItem('readingProgress', JSON.stringify(progress));
        } catch (error) {
            console.error('Error updating chapter state:', error);
        }
    };
    
    const handleImageLoaded = (index, event) => {
        const { width, height } = event.nativeEvent.source;
        const scaleFactor = width / screenWidth;
        const imageHeight = height / scaleFactor;
        setImageHeights(prevHeights => ({ ...prevHeights, [index]: imageHeight }));
        
        if(index == imageUrls.length - 1) {
            console.log(index);
            setAtEnd(true);
        }
        setLoading(false);
    };


    return (
        <View>
            {loading && (
                <View style={styles.mangaListItem}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.mangaListTitle}>Loading chapter...</Text>
                </View>
            )}
            <FlatList
                ref={scrollViewRef}
                style={dynamicStyles.scrollView}
                data={imageUrls}
                initialNumToRender={2}
                renderItem={({ item, index }) => (
                    <Image
                        key={index}
                        source={{ uri: item }}
                        style={[dynamicStyles.chapterImage, { height: imageHeights[index] || 200 }]}
                        onLoad={(event) => handleImageLoaded(index, event)}
                        
                    />
                )}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (atEnd) {
                        markChapterAsCompleted();
                    }
                }}
                ListFooterComponent={() => atEnd && (
                    <ChapterNavigationShadowBox
                        onPreviousChapter={() => navigateToChapter(prevChapterId)}
                        onNextChapter={() => navigateToChapter(nextChapterId)}
                    />
                )}
            />
        </View>
    );
    
}

export default ChapterImagesScreen