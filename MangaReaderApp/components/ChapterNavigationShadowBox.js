import { useTheme } from '../ThemeContext'; // Adjust the import path according to your project structure
import styles from '../Styles.js';
import { ScrollView, View, TouchableOpacity, Image, Text, FlatList } from 'react-native';

const ChapterNavigationShadowBox = ({ onPreviousChapter, onNextChapter }) => {
    const { theme } = useTheme(); // Use your custom hook to get the current theme, if needed
    const dynamicStyles = styles(theme); // Adjust the styles call as needed

    return (
        <View style={dynamicStyles.navigationShadowBox}>
            <TouchableOpacity onPress={onPreviousChapter} style={dynamicStyles.navigationButton}>
                <Text style={dynamicStyles.navigationButtonText}>Previous Chapter</Text>
            </TouchableOpacity>

            <View style={dynamicStyles.verticalLine}></View>

            <TouchableOpacity onPress={onNextChapter} style={dynamicStyles.navigationButton}>
                <Text style={dynamicStyles.navigationButtonText}>Next Chapter</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChapterNavigationShadowBox;

