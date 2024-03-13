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
      width: '100%',
      height: 300,
      resizeMode: 'cover',
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
    mangaDetailsContainer: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#1f2023' : '#fafafa',
      padding: 20,
    },
    mangaImageWrapper: {
      position: 'relative',
      marginBottom: 20,
      alignItems: 'center',
    },
    mangaThumbnail: {
      width: screenWidth - 40, // Adjust for padding
      height: 300,
      borderRadius: 10,
      resizeMode: 'cover',
    },
    bookmarkIconStyle: {
      position: 'absolute',
      right: 0,
      top: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 8,
      borderRadius: 50,
    },
    mangaTitleStyle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
      marginBottom: 10,
      textAlign: 'center',
    },
    mangaChaptersScroll: {
      flex: 1,
    },
    mangaChapterItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colorScheme === 'dark' ? '#252829' : '#FFFFFF', // Using a slightly off-black or pure white background
      paddingHorizontal: 16,
      paddingVertical: 12, // Slightly more vertical padding for a better touch target
      borderBottomWidth: 0, // Removing the border for a cleaner look
      // Optional: add a subtle shadow or border for separation, depending on your preference for flat design
      marginVertical: 4,
      borderRadius: 8, // Rounded corners for a modern touch
    },
    chapterTitleStyle: {
      fontSize: 17, // Slightly larger font size for readability
      color: colorScheme === 'dark' ? '#E1E1E1' : '#212121', // High contrast text color
      fontWeight: '500', // Medium font weight for a cleaner appearance
    },
    progressIndicatorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressIcon: {
      marginLeft: 8,
      // Consider using FontAwesome icons that fit the flat design, such as solid circles or checks
    },
    mangaListContainer: {
      backgroundColor: colorScheme === 'dark' ? '#1f2023' : '#FFFFFF',
    },
    mangaListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#2a2b2e' : '#f9f9f9',
      borderRadius: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    mangaListThumbnail: {
      width: 70,
      height: 70,
      borderRadius: 10,
      marginRight: 10,
    },
    mangaListTitle: {
      fontSize: 18,
      color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
      fontWeight: '600',
      flexShrink: 1,
    },
    chapterIndicatorInProgress: {
      color: 'gold', // Using a more vibrant yellow for the in-progress indicator
    },
    chapterIndicatorCompleted: {
      color: '#4CAF50', // A vibrant green for the completed indicator
    },
  });

export default styles;