import * as React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';

export default function EditProfile() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={{backgroundColor: BACKGROUNDCOLOR, height: "100%"}}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : { width: "100%" }]}>
                <Text>Test</Text>
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
    },
});