import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, FlatList, TextInput } from 'react-native';
import { Dimensions, RefreshControl } from 'react-native';
import axios from 'axios';
import { parseString } from 'react-native-xml2js';
import { useTheme } from '../ThemeContext'; // Adjust the import path according to your project structure
import styles from '../Styles.js';
import { BASE_URL } from '../constants'; // Adjust the path according to where you placed the constants.js file
import { AUTH_TOKEN, API_KEY } from '@env';

function MangaListScreen({ navigation }) {
    const { theme } = useTheme(); // Use your custom hook to get the current theme
    // Assuming you have a styles function that generates dynamic styles based on the theme and screenWidth
    const dynamicStyles = styles(theme, Dimensions.get('window').width, Dimensions.get('window').height);
    const [mangaList, setMangaList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchManga();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchManga().then(() => {
          setRefreshing(false);
        }).catch((error) => {
          console.error('Failed to refresh manga list:', error);
          setRefreshing(false); 
        });
    };
              // Render Item for FlatList
    const renderItem = ({ item: manga }) => (
    <TouchableOpacity
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
    );
    const filteredMangaList = mangaList.filter(manga => 
        manga.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const api = axios.create({
		baseURL: BASE_URL,
		headers: {
			Authorization: `Bearer ${AUTH_TOKEN}`,
		}
  	});

    const fetchManga = () => {
        return new Promise((resolve, reject) => { 
            axios.get(`${BASE_URL}/kavita/api/opds/fa66341c-d3a3-432b-bcb1-d83593ca8103/libraries/1`)
                .then(response => {
                    parseString(response.data, (err, result) => {
                        if (err) {
                            console.error('Error parsing XML:', err);
                            reject(err); 
                            return;
                        }
                        const entries = result.feed.entry;
                        const formattedManga = entries.map(entry => ({
                            id: entry.id[0],
                            title: entry.title[0],
                            thumbnail: entry.link.find(link => link.$.rel.includes('http://opds-spec.org/image/thumbnail')).$.href,
                            coverImage: entry.link.find(link => link.$.rel.includes('image')).$.href,
                        }));
                        setMangaList(formattedManga);
                        resolve(); 
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    reject(error); 
                });
        });
    };
    
    

    return (
        <View style={dynamicStyles.container}>
        <View style={dynamicStyles.searchBarContainer}>
        <Text style={dynamicStyles.settingsText}>Search</Text>
          <TextInput
            style={dynamicStyles.searchBar}
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
        </View>
        <FlatList
          data={filteredMangaList}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          style={dynamicStyles.mangaListContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#9Bd35A", "#689F38"]} // Customize the spinner colors (Android)
              tintColor="#689F38" // Spinner color (iOS)
            />
          }
        />
      </View>
      );
    }

export default MangaListScreen;