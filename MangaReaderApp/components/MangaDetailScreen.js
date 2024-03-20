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
import { AUTH_TOKEN, API_KEY } from '@env';
import styles from '../Styles.js';

const screenWidth = Dimensions.get('window').width;

function MangaDetailScreen({ route, navigation }) {
    const { manga } = route.params;
    const [chapters, setChapters] = useState([]);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [readingProgress, setReadingProgress] = useState({});
    const { theme } = useTheme(); // Use your custom hook to get the current theme
    const dynamicStyles = styles(theme, screenWidth);

    const api = axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
        }
    });

    const fetchSeriesInfo = async() => {
        try {
            const url = `kavita/api/Series/volumes?seriesId=${manga.id}`;
            const response = await api.get(url);
            if (response && response.data) {
                console.log("length of array ", response.data.length);
                const formattedChapters = [];
                for(let i = 0; i < response.data.length; i++) {
                    const chapterData = response.data[i].chapters.map(chapter => ({
                        id: chapter.id,
                        title: response.data[i].name === "0" ? chapter.title : response.data[i].name,
                        pages: chapter.pages,
                      }));
                      formattedChapters.push(...chapterData);
                }
                setChapters(formattedChapters);
            }
        } catch (error) {
            console.error('Error fetching chapter info:', error);
        }
    };

    useEffect(() => {
        fetchSeriesInfo();
        // checkBookmarkStatus();
        console.log(`Manga id: ${manga.id}; Manga title: ${manga.title}; Manga thumbnail: ${manga.thumbnail != null}`);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchReadingProgress();
        }, [])
    );

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
            <Image source={{ uri: manga.thumbnail }} style={dynamicStyles.mangaThumbnail} />
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
                onPress={() => navigation.navigate('ChapterImages', {
                    chapterId: chapter.id,
                    mangaId: manga.id,
                    pages: chapters[index].pages,
                    chapters: chapters, // Include the entire chapters array
                    title: "Chapter "+chapter.title
                  })}
            >
                <Text style={dynamicStyles.chapterTitleStyle}>{manga.title + ' - Chapter ' + chapter.title}</Text>
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