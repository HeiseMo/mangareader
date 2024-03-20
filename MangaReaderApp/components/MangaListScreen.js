import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, FlatList, TextInput } from 'react-native';
import { Dimensions, RefreshControl } from 'react-native';
import axios from 'axios';
import { parseString } from 'react-native-xml2js';
import { useTheme } from '../ThemeContext'; // Adjust the import path according to your project structure
import styles from '../Styles.js';
import { BASE_URL } from '../constants'; // Adjust the path according to where you placed the constants.js file
import { AUTH_TOKEN, API_KEY } from '@env';
global.Buffer = global.Buffer || require('buffer').Buffer;

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

	useEffect(() => {
		if (mangaList.length > 0) {
			setCoverImage();
		} else {
			console.log('No manga found');
		}
	}, [mangaList]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchManga().then(() => {
          	setRefreshing(false);
        }).catch((error) => {
			console.error('Failed to refresh manga list:', error);
			setRefreshing(false); 
        });
    };
    
    const renderItem = ({ item: manga }) => (
		<TouchableOpacity
			style={dynamicStyles.mangaListItem}
			onPress={() => navigation.navigate('MangaDetail', { manga })}
			activeOpacity={0.7}
		>
			<Image
				source={{ uri: manga.thumbnail }}
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

	  const fetchManga = async () => {
		const data = {
			"id": 0,
			"statements": [],
			"combination": 0,
			"sortOptions": {
				"sortField": 1,
				"isAscending": true
			},
			"limitTo": 0
		};
	
		const url = `kavita/api/Series/all-v2`;
	
		try {
			const response = await api.post(url, data);
			if (response && response.data) {
				const formattedSeries = response.data.map(series => ({
					id: series.id,
					title: series.name,
				}));
				setMangaList(formattedSeries);
				// Assuming you might have other async tasks here, you can await them within Promise.all()
				await Promise.all([/* other async tasks */]);
			} else {
				throw new Error("No data received from the server");
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const setCoverImage = async() => {
		const fetchCoverImage = async(seriesId) => {
			
			const url = `kavita/api/Image/series-cover?seriesId=${seriesId}&apiKey=${API_KEY}`;
			try {
				const response = await api.get(url, {responseType: 'arraybuffer'});
				if (response && response.data) {
					const binaryData = response.data;
					const base64Image = Buffer.from(binaryData).toString('base64');
					const imageUri = `data:image/png;base64,${base64Image}`;
					return imageUri; // Return the image URI
				} else {
					console.error(`Error fetching image for SeriesID ${seriesId}`);
					console.error("caught in else");
					return null; // Return null if there's an error or no response data
				}
			} catch {
				console.error(`Error fetching image for SeriesId ${seriesId}`);
			}
		};
		if(mangaList[0].thumbnail == null) {
			const promise = [];
			for (const manga of mangaList) {
				promise.push(fetchCoverImage(manga.id).then((thumbnail) => ({...manga, thumbnail})));
			}
			const updatedMangaList = await Promise.all(promise);
			setMangaList(updatedMangaList);
		}
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