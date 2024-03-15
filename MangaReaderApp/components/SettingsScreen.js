import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../ThemeContext';
import styles from '../Styles.js';
const screenWidth = Dimensions.get('window').width;

const SettingsScreen = () => {
    const { theme, toggleTheme } = useTheme();
    const dynamicStyles = styles(theme, screenWidth);
    const handleDeleteCache = () => console.log('Cache deleted');

    const SettingsRow = ({ title, onPress, isSelected }) => (
        <TouchableOpacity style={dynamicStyles.settingsRow} onPress={onPress}>
            <Text style={dynamicStyles.settingsText}>{title}</Text>
            <View style={[dynamicStyles.radioButton, isSelected && dynamicStyles.radioButtonSelected]} />
        </TouchableOpacity>
    );

    return (
        <View style={dynamicStyles.container}>
            <Text style={dynamicStyles.headerText}>Theme</Text>
            <View style={dynamicStyles.radioGroup}>
                <SettingsRow title="Light Mode" onPress={() => theme !== 'light' && toggleTheme()} isSelected={theme === 'light'} />
                <SettingsRow title="Dark Mode" onPress={() => theme !== 'dark' && toggleTheme()} isSelected={theme === 'dark'} />
            </View> 
            <Text style={dynamicStyles.headerText}>General Settings</Text>
            <TouchableOpacity style={dynamicStyles.button} onPress={handleDeleteCache}>
                <Text style={dynamicStyles.buttonText}>Delete Cache</Text>
            </TouchableOpacity>

            <Text style={dynamicStyles.headerText}>App Info</Text>
            <Text style={dynamicStyles.infoText}>Client Version: 1.0.0</Text>
        </View>
    );
};

export default SettingsScreen;
