import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions, ScrollView } from 'react-native';
import { MAINCOLOR } from '../Constants/colors';

export default function Tierprofil() {
    //TODO: Is this right? Currently we have to use this line in every function. (duplicate code)
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                contentContainerStyle={styles.item}
                keyboardDismissMode="on-drag"
            >
                <View>
                    <Text>Tierprofil</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAINCOLOR,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    }
});