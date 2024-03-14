import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from './ThemeContext'; // Adjust the import path

export default function SettingsScreen() {
    const { toggleTheme } = useTheme();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Settings Screen</Text>
            <TouchableOpacity onPress={toggleTheme} style={{ marginTop: 20, padding: 10, backgroundColor: '#dddddd' }}>
                <Text>Toggle Theme</Text>
            </TouchableOpacity>
        </View>
    );
}
