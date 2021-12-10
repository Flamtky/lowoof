import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions, ScrollView } from 'react-native';
import OwnButton from '../Components/ownButton';
import { MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../../App';

export default function Settings({ navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                contentContainerStyle={styles.item}
                keyboardDismissMode="on-drag"
            >
                <View>
                    <Text>{language.SETTINGS.HEADER[currentLanguage]}</Text>
                </View>
            </ScrollView>
            <OwnButton title={language.BACK[currentLanguage]} style={{ margin: 32, alignSelf: "flex-start" }} onPress={() => {
                navigation.goBack();
            }} />
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