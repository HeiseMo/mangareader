import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity,Dimensions } from 'react-native';
import axios from 'axios';
import { parseString } from 'react-native-xml2js';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBookmark as faBookmarkSolid, faStar, faShareAlt, faCheckCircle, faCircle, } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { useTheme } from '../ThemeContext'; // Adjust the path as necessary
import { BASE_URL } from '../constants'; // Adjust the path according to where you placed the constants.js file

import styles from '../Styles.js';

const screenWidth = Dimensions.get('window').width;

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
        console.log(manga)
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
            <Image source={{ uri: `${BASE_URL}${manga.thumbnail}&cacheBuster=${Date.now()}` }} style={dynamicStyles.mangaThumbnail} />
            <TouchableOpacity onPress={toggleBookmark} style={dynamicStyles.bookmarkIconStyle}>
            <FontAwesomeIcon style={dynamicStyles.generalBookmarkIcon} icon={isBookmarked ? faBookmarkSolid : faBookmarkRegular} size={24} />
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

export default MangaDetailScreen