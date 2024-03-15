import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Image, Text } from 'react-native';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { parseString } from 'react-native-xml2js';
import { useTheme } from '../ThemeContext'; // Adjust the import path according to your project structure
import styles from '../Styles.js';
import { BASE_URL } from '../constants'; // Adjust the path according to where you placed the constants.js file


function MangaListScreen({ navigation }) {
    const { theme } = useTheme(); // Use your custom hook to get the current theme
    // Assuming you have a styles function that generates dynamic styles based on the theme and screenWidth
    const dynamicStyles = styles(theme, Dimensions.get('window').width);
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
                    source={{ uri: `${BASE_URL}${manga.thumbnail}`}}
                    style={dynamicStyles.mangaListThumbnail}
                />
                    <Text style={dynamicStyles.mangaListTitle}>{manga.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}


export default MangaListScreen;