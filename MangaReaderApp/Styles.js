import { StyleSheet } from 'react-native';

const styles = (theme, screenWidth) => {
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#010101' : '#F2F2F2';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const containerColor = isDark ? '#161B22' : '#F2F2F2';
  const colorBorder = '#ccc';

return StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
        padding: 20,
        color: textColor,
    },
    mangaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 10,
    },
    largeThumbnail: {
      width: '100%', // Full width of the item
      aspectRatio: 3 / 4, // Maintain aspect ratio of thumbnails
      resizeMode: 'contain', // Cover the item area completely
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
      backgroundColor: theme === 'dark' ? '#010101' : '#F2F2F2',
      padding: 20,
    },
    mangaImageWrapper: {
      position: 'relative',
      marginBottom: 20,
      alignItems: 'center',
    },
    mangaThumbnail: {
      width: '50%', // Full width of the item
      aspectRatio: 3 / 4, // Maintain aspect ratio of thumbnails
      resizeMode: 'contain', // Cover the item area completely
    },
    generalBookmarkIcon: {
      backgroundColor: containerColor,
      color: theme === 'dark' ? 'gold' : 'gold',
    },
    bookmarkIconStyle: {
      position: 'absolute',
      right: 10,
      top: 10,
      color: textColor,
      borderColor : 'white',
      padding: 16,
      borderRadius: 10,
      borderWidth: 0,
      backgroundColor: containerColor,
    },
    mangaTitleStyle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: textColor,
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
      backgroundColor: containerColor, // Using a slightly off-black or pure white background
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
      flex: 1,
      backgroundColor: theme === 'dark' ? '#010101' : '#F2F2F2',
    },
    mangaListItem: {
      flex: 1,
      margin: 5, // Add margins for spacing between grid items
      borderRadius: 10, // Rounded corners for thumbnails
      height: 330,
      overflow: 'hidden', // Ensures the borderRadius is applied to the child Image
      backgroundColor: theme === 'dark' ? '#161B22' : 'white',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 3,
      alignItems: 'center',
      justifyContent: 'center',

    },
    mangaListThumbnail: {
      width: '100%', // Full width of the item
      aspectRatio: 3 / 4, // Maintain aspect ratio of thumbnails
      resizeMode: 'contain', // Cover the item area completely
    },
    mangaListTitle: {
      fontSize: 18,
      color: textColor,
      fontWeight: '600',
      flexShrink: 1,
    },
    searchBarContainer: {
      padding: 10,
    },
    searchBar: {
      height: 40,
      backgroundColor: theme === 'dark' ? '#161B22' : 'white',
      color: textColor,
      borderRadius: 10,
      paddingHorizontal: 10,
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
      color: textColor,
      
  },

  settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 25,
      paddingHorizontal: 20,
      borderColor: '#ccc',
      color: textColor,
      selectedButtonColor: 'white'
  },
  settingsText: {
      fontSize: 14,
      color: "#9e9e9e",
  },
  radioGroup: {
    height: "20%",
    width: "99%",
    backgroundColor: theme === 'dark' ? '#161B22' : 'white',
    justifyContent: 'center',
    borderRadius: 5, // Adjust this value as needed for the desired curvature
    borderColor: theme === 'dark' ? '#606266' : '#ccc',// Sets the border color
    borderWidth: 1, // You need to specify a borderWidth to show the border
},
  settingsGroup:{
    height: "50%",
    width: "99%",
    paddingVertical: 5,
    backgroundColor: theme === 'dark' ? '#161B22' : 'white',
    borderRadius: 10, // Adjust this value as needed for the desired curvature
    borderColor: theme === 'dark' ? '#606266' : '#ccc',// Sets the border color
    borderWidth: 1, // You need to specify a borderWidth to show the border
  },
  infoGroup:{
    height: "10%",
    width: "99%",
    backgroundColor: theme === 'dark' ? '#161B22' : 'white',
    justifyContent: 'center',
    borderRadius: 5, // Adjust this value as needed for the desired curvature
    borderColor: theme === 'dark' ? '#606266' : '#ccc',// Sets the border color
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
      color: textColor,
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
    backgroundColor: '#606266', // Light grey color, adjust based on your theme or preference
    marginVertical: 8, // Provides vertical space around the line, adjust as needed
  },
  });
}
export default styles;