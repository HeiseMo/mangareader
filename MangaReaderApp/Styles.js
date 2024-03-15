import { StyleSheet } from 'react-native';

const styles = (theme, screenWidth) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme === 'dark' ? '#010101' : '#F2F2F2',
        padding: 20,
        color: theme === 'dark' ? '#FFFFFF' : '#000000',
    },
    mangaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 10,
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
      backgroundColor: theme === 'dark' ? '#1f2023' : '#fafafa',
      padding: 20,
    },
    mangaImageWrapper: {
      position: 'relative',
      marginBottom: 20,
      alignItems: 'center',
    },
    mangaThumbnail: {
      width: screenWidth - 40, // Adjust for padding
      borderRadius: 10,
      resizeMode: 'cover',
      aspectRatio: 0.8
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
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
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
      backgroundColor: theme === 'dark' ? '#252829' : '#FFFFFF', // Using a slightly off-black or pure white background
      paddingHorizontal: 16,
      paddingVertical: 12, // Slightly more vertical padding for a better touch target
      borderBottomWidth: 0, // Removing the border for a cleaner look
      // Optional: add a subtle shadow or border for separation, depending on your preference for flat design
      marginVertical: 4,
      borderRadius: 8, // Rounded corners for a modern touch
    },
    chapterTitleStyle: {
      fontSize: 17, // Slightly larger font size for readability
      color: theme === 'dark' ? '#E1E1E1' : '#212121', // High contrast text color
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
      backgroundColor: theme === 'dark' ? '#1f2023' : '#FFFFFF',
    },
    mangaListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#2a2b2e' : '#f9f9f9',
      borderRadius: 10,
      marginVertical: 10,
      marginHorizontal: 16,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    mangaListThumbnail: {
      height: 200,
      borderRadius: 10,
      marginRight: 10,
      aspectRatio: 0.8,
    },
    mangaListTitle: {
      fontSize: 18,
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      fontWeight: '600',
      flexShrink: 1,
    },
    chapterIndicatorInProgress: {
      color: 'gold', // Using a more vibrant yellow for the in-progress indicator
    },
    chapterIndicatorCompleted: {
      color: '#4CAF50', // A vibrant green for the completed indicator
    },
    headerText: {
      fontSize: 16,
      fontWeight: "900",
      marginTop: 20,
      marginBottom: 5,
      marginLeft: 20,
      letterSpacing: -0.5,
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      
  },

  settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 25,
      paddingHorizontal: 20,
      borderColor: '#ccc',
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      selectedButtonColor: 'white'
  },
  settingsText: {
      fontSize: 16,
      color: theme === 'dark' ? '#FFFFFF' : '#9e9e9e',
  },
  radioGroup: {
    height: "20%",
    width: "99%",
    backgroundColor: theme === 'dark' ? '#161B22' : 'white',
    justifyContent: 'center',
    borderRadius: 5, // Adjust this value as needed for the desired curvature
    borderColor: theme === 'dark' ? '#E6EDF3' : '#ccc',// Sets the border color
    borderWidth: 1, // You need to specify a borderWidth to show the border
},
  settingsGroup:{
    height: "50%",
    width: "99%",
    paddingVertical: 5,
    backgroundColor: theme === 'dark' ? '#161B22' : 'white',
    borderRadius: 10, // Adjust this value as needed for the desired curvature
    borderColor: theme === 'dark' ? '#ccc' : '#ccc',// Sets the border color
    borderWidth: 1, // You need to specify a borderWidth to show the border
  },
  infoGroup:{
    height: "10%",
    width: "99%",
    backgroundColor: theme === 'dark' ? '#161B22' : 'white',
    justifyContent: 'center',
    borderRadius: 5, // Adjust this value as needed for the desired curvature
    borderColor: theme === 'dark' ? '#ccc' : '#ccc',// Sets the border color
    borderWidth: 1, // You need to specify a borderWidth to show the border
    color: "#9e9e9e"
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: theme === 'dark' ? '#FFFFFF' : '#010101', // Adjust the border color based on the theme
    alignItems: 'center',
    justifyContent: 'center',
},
radioButtonSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme === 'dark' ? '#F2F2F2' : '#010101', // Adjust the selected background color based on the theme
    alignItems: 'center',
    justifyContent: 'center',
},
  button: {
      width: "50%",
      marginHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: '#ED5E68',
      alignItems: 'center',
      borderRadius: 10,
      marginTop: 10,
  },
  buttonText: {
      fontSize: 16,
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
  },
  infoText: {
      fontSize: 12,
      paddingVertical: 4,
      paddingHorizontal: 20,
      borderColor: '#ccc',
      color: theme === 'dark' ? '#cccccc' : '#9e9e9e',
  },
  horizontalLine: {
    height: 1, // Thin line
    backgroundColor: '#E0E0E0', // Light grey color, adjust based on your theme or preference
    marginVertical: 8, // Provides vertical space around the line, adjust as needed
  },
  });

export default styles;