import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, TouchableOpacity, Image, Text, FlatList } from 'react-native';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseString } from 'react-native-xml2js';
import { useTheme } from '../ThemeContext'; 
import styles from '../Styles.js';
import { BASE_URL } from '../constants'; 
import ChapterNavigationShadowBox from './ChapterNavigationShadowBox';

const screenWidth = Dimensions.get('window').width;
function ChapterImagesScreen({ route }) {
    const navigation = useNavigation(); // Hook to get access to the navigation object
    const { chapterId, mangaId, thumbnail, chapters, title } = route.params;
    const [imageUrls, setImageUrls] = useState([]);
    const [imageHeights, setImageHeights] = useState({});
    const [prevChapterId, setPrevChapterId] = useState(null);
    const [nextChapterId, setNextChapterId] = useState(null);
    const { theme } = useTheme(); 
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
    };

    const fetchChapterImages = (chapterId, mangaId) => {
        console.log(`Fetching chapter images for mangaId: ${mangaId}, chapterId: ${chapterId}`);
        axios.get(`${BASE_URL}/kavita/api/opds/a828d819-35d0-4810-8cc8-9feaaf440123/series/${mangaId}/volume/8/chapter/${chapterId}`)
            .then((response) => {
                console.log(`Response received for chapter images.`);
                parseString(response.data, { explicitArray: false, mergeAttrs: true }, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }
    
                    // Debugging the parsed result
                    console.log(`Parsed result for chapter images:`, result);
    
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
                    const urlTemplate = `${BASE_URL}${streamLink.href}&cacheBuster=${Date.now()}`;
                    const imageUrls = Array.from({ length: pageCount }, (_, i) =>
                        urlTemplate.replace('{pageNumber}', i)
                    );
    
                    setImageUrls(imageUrls);
                });
            })
            .catch((error) => {
                console.error('Error fetching chapter images:', error);
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.error(error.response.data);
                  console.error(error.response.status);
                  console.error(error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  console.error(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.error('Error', error.message);
                }
                console.error(error.config);
              });
    };

    const navigateToChapter = (newChapterId) => {
        const newChapter = chapters.find(ch => ch.id === newChapterId);
        if (newChapter) {
            const newTitle = newChapter.title.replace(/^.*?(\d+).*$/, 'Chapter $1'); // Adjust this to your title format
            console.log(newTitle, "new title");
            navigation.setOptions({ title: newTitle }); // Dynamically update the title
    
            navigation.navigate('ChapterImages', {
                chapterId: newChapterId,
                mangaId: mangaId,
                thumbnail: thumbnail,
                chapters: chapters, // Pass the chapters list if needed
                title: newTitle // Pass the new title for initial render
            });
        } else {
            console.error('Chapter not found');
        }
    };
    



    return (
        <FlatList
            ref={scrollViewRef}
            style={dynamicStyles.scrollView}
            data={imageUrls}
            renderItem={({ item, index }) => (
                <Image
                    key={index}
                    source={{ uri: item }} 
                    style={[dynamicStyles.chapterImage, { height: imageHeights[index] || 200 }]}
                    onLoad={event => handleImageLoaded(index, event)}
                />
            )}
            onEndReachedThreshold={0.5}
            onEndReached={({ distanceFromEnd }) => {
                if (distanceFromEnd >= 0) {
                    markChapterAsCompleted();
                }
            }}
            ListFooterComponent={() => (
                <ChapterNavigationShadowBox
                    onPreviousChapter={() => navigateToChapter(prevChapterId)}
                    onNextChapter={() => navigateToChapter(nextChapterId)}
                />
            )}
        />
    );
    
}

export default ChapterImagesScreen