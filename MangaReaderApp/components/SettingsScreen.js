import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles.js';
import packageInfo from '../package.json';
const screenWidth = Dimensions.get('window').width;

const SettingsScreen = () => {
    const { theme, toggleTheme } = useTheme();
    const dynamicStyles = styles(theme, screenWidth);
    const [isEndlessScroll, setIsEndlessScroll] = React.useState(false);
    const toggleEndlessScroll = () => {
        setIsEndlessScroll(prev => !prev);
        AsyncStorage.setItem('@mangaReaderApp:endlessScroll', JSON.stringify(!isEndlessScroll));
    }
    React.useEffect(() => {
        AsyncStorage.getItem('@mangaReaderApp:endlessScroll').then(value => {
            if (value !== null) {
                setIsEndlessScroll(JSON.parse(value));
            }
        });
    }, []);

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
                <View style={dynamicStyles.horizontalLine} />
                <SettingsRow title="Dark Mode" onPress={() => theme !== 'dark' && toggleTheme()} isSelected={theme === 'dark'} />
            </View>

            <Text style={dynamicStyles.headerText}>Actions</Text>


            <View style={dynamicStyles.settingsGroup}>
                <View style={dynamicStyles.toggleRow}>
                    <Text style={dynamicStyles.readingModeText}>
                        {isEndlessScroll ? 'Endless Scrolling' : 'Normal Mode'}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEndlessScroll ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleEndlessScroll}
                        value={isEndlessScroll}
                    />
                </View>
                <View style={dynamicStyles.horizontalLine} />
                <TouchableOpacity style={dynamicStyles.button} onPress={handleDeleteCache}>
                    <Text style={dynamicStyles.buttonText}>Delete Cache</Text>
                </TouchableOpacity>
            </View>
            <Text style={dynamicStyles.headerText}>App Info</Text>
            <View style={dynamicStyles.infoGroup}>
                <Text style={dynamicStyles.infoText}>App name: {packageInfo.name}</Text>
                <Text style={dynamicStyles.infoText}>Client Version: {packageInfo.version}</Text>
            </View>
        </View>
    );
};

export default SettingsScreen;

