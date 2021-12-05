import { faCommentDots, faExclamationTriangle, faStar, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet, View, Image, Text, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import OwnButton from '../Components/ownButton';
import Seperator from '../Components/seperator';
import { TextBlock } from '../Components/styledText';
import { BLACK, MAINCOLOR } from '../Constants/colors';

export default function Suche({ navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <View style={[styles.row, {marginLeft: 15, height: 60}]}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Mein Profil') }} >
                        <Image style={styles.profilepicture}
                            source={{ uri: "https://puu.sh/IsTPQ/5d69029437.png" }}
                        />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 10, height: "100%", justifyContent: "space-between"}}>
                        <TextBlock>Besitzer: </TextBlock>
                        <TextBlock>Rufname: </TextBlock>
                        <View style={[styles.row, {marginTop: 0}]}>
                            <TextBlock>Art: </TextBlock>
                            <TextBlock>Rasse: </TextBlock>
                        </View>
                    </View>
                    <View style={[styles.row, { marginLeft: "auto", right: "5%" }]}>
                        <TouchableOpacity onPress={() => { /* Matchen/Attractive */}} style={{marginRight:6}}>
                            <FontAwesomeIcon icon={faStar} size={32} color="#fc5"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { /* Chat */ }} style={{marginRight:6}}>
                            <FontAwesomeIcon icon={faCommentDots} size={32} color="#0a0"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { alert("Tier gelöscht")/* Unfriend */ }} style={{marginRight:6}}>
                            <FontAwesomeIcon icon={faTrashAlt} size={32} color="#555"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { /* Report */ }} style={{marginRight:6}}>
                            <FontAwesomeIcon icon={faExclamationTriangle} size={32} color="#f66"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <Seperator />
            </ScrollView>
            <OwnButton title="Zurück" style={{ margin: 32, alignSelf: "flex-start" }} onPress={() => {
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