import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView } from 'react-native';
import OwnButton from '../Components/ownButton';
import PetItem from '../Components/petItem';
import Seperator from '../Components/seperator';
import { BLACK, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';


export default function Suche({ navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }} keyboardDismissMode="on-drag">
                <PetItem/>
                <Seperator/>
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
    },
    profilepicture: {
        width: 64,
        height: 64,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#000",
        backgroundColor: BLACK,
    },
    row: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "flex-start",
    },
});