import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, TouchableOpacity, Image, Text } from 'react-native';
import { Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseString } from 'react-native-xml2js';
import { useTheme } from '../ThemeContext'; // Adjust the import path according to your project structure
import styles from '../Styles.js';
import { BASE_URL } from '../constants'; // Adjust the path according to where you placed the constants.js file

const screenWidth = Dimensions.get('window').width;
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
            style={dynamicStyles.scrollView}
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

export default ChapterImagesScreen