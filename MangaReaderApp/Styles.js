import { StyleSheet } from 'react-native';

const styles = (colorScheme, screenWidth) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#1f2023' : '#fafafa',
        padding: 20,
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
    chapterList: {
      marginTop: 10,
    },
    chapterItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        fontSize: 16,
        marginTop: 5,
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
    },
    chapterImage: {
      width: screenWidth, // Ensure the image fills the width
      resizeMode: 'contain', // Maintain the aspect ratio. Consider 'cover' if you want images to fill the screen fully.
    },
  // Consider adding styles for the scrollView to manage the overall background and alignment
    scrollView: {
      backgroundColor: '#000', // Optional, consider setting a background color that matches your app theme or images
    },
});

export default styles;