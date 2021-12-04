import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';

export function Chat() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : null]}>
                <ScrollView keyboardDismissMode='on-drag' style={{ height: "100%", width: "100%" }}>
                    {/*Messages*/}
                </ScrollView>
                <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
                    <SearchBar
                        placeholder="Nachricht...."
                        style={styles.input}
                    />
                    <OwnButton title="➤" style={{ width: 40, padding: 0, minWidth: 0, borderRadius: 0, bottom: -0.3 }} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAINCOLOR,
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%"
    },
    input: {
        height: 42,
        width: "90%",
        alignSelf: 'flex-end',
        borderRadius: 0,
    },
});