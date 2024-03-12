import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { parseString } from 'react-native-xml2js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const BASE_URL = 'https://ftgglin3.oasis.usbx.me'; // Replace with your base URL
const Stack = createNativeStackNavigator();

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function MangaListScreen({ navigation }) {
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
        <ScrollView>
            {mangaList.map((manga) => (
                <TouchableOpacity key={manga.id} style={styles.mangaItem} onPress={() => navigation.navigate('MangaDetail', { manga })}>
                    <Image source={{ uri: `${BASE_URL}${manga.thumbnail}` }} style={styles.thumbnail} />
                    <Text style={styles.title}>{manga.title}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

function ChapterImagesScreen({ route }) {
  const { chapterId } = route.params;
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
      fetchChapterImages(chapterId);
  }, [chapterId]);

  const fetchChapterImages = (chapterId) => {
    axios.get(`${BASE_URL}/kavita/api/opds/fa66341c-d3a3-432b-bcb1-d83593ca8103/series/2/volume/7/chapter/${chapterId}`)
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
                    urlTemplate.replace('{pageNumber}', i + 1) // Assuming page numbering starts from 1
                );
  
                setImageUrls(imageUrls);
            });
        })
        .catch((error) => {
            console.error('Error fetching chapter images:', error);
        });
  };



  return (
      <ScrollView style={styles.scrollView}>
          <View style={styles.imageContainer}>
              {imageUrls.map((url, index) => (
                  <Image key={index} source={{ uri: url }} style={styles.chapterImage} />
              ))}
          </View>
      </ScrollView>
  );
}



function MangaDetailScreen({ route, navigation }) {
  const { manga } = route.params;
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
      fetchChapters();
  }, []);

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

  return (
      <View style={styles.container}>
          <Text style={styles.title}>{manga.title}</Text>
          <Image source={{ uri: `${BASE_URL}${manga.thumbnail}` }} style={styles.largeThumbnail} />
          <Text style={styles.subtitle}>Chapters</Text>
          <ScrollView style={styles.chapterList}>
              {chapters.map((chapter, index) => (
                  <TouchableOpacity 
                      key={index} 
                      style={styles.chapterItem}
                      onPress={() => navigation.navigate('ChapterImages', { chapterId: chapter.id })}
                  >
                      <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  </TouchableOpacity>
              ))}
          </ScrollView>
      </View>
  );
}


export default function App() {
  return (
      <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen name="MangaList" component={MangaListScreen} options={{ title: 'Manga List' }} />
              <Stack.Screen name="MangaDetail" component={MangaDetailScreen} options={{ title: 'Manga Detail' }} />
              <Stack.Screen name="ChapterImages" component={ChapterImagesScreen} options={{ title: 'Chapter Images' }} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 50
    },
    mangaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 10,
    },
    thumbnail: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    largeThumbnail: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    title: {
        fontSize: 16,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
  },
  chapterItem: {
      fontSize: 16,
      marginTop: 5,
  },
  chapterList: {
    marginTop: 10,
},
chapterItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
},
chapterTitle: {
    fontSize: 16,
},
  imageContainer: {
    alignItems: 'center', // Ensure images are stretched to fill the width, if not already by the image styles
    justifyContent: "space-between"
  },
  chapterImage: {
    width: screenWidth, // Ensure the image fills the width
    height: 1200,
    resizeMode: 'contain', // Maintain the aspect ratio. Consider 'cover' if you want images to fill the screen fully.
  },
  // Consider adding styles for the scrollView to manage the overall background and alignment
  scrollView: {
    backgroundColor: '#000', // Optional, consider setting a background color that matches your app theme or images
  },
});
