import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCommentDots, faExclamationTriangle, faHeart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { StyleSheet, View, Image, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { BLACK, MAINCOLOR } from '../Constants/colors';
import { TextBlock } from '../Components/styledText';
import Seperator from '../Components/seperator';

export default function Matches({navigation}:any) {
    //TODO: Is this right? Currently we have to use this line in every function. (duplicate code)
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
                        <TouchableOpacity onPress={() => { /* FA */}} style={{marginRight:6}}>
                            <FontAwesomeIcon icon={faHeart} size={32} color="#f00"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { /* Chat */ }} style={{marginRight:6}}>
                            <FontAwesomeIcon icon={faCommentDots} size={32} color="#0a0"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { /* Unmatchen */ }} style={{marginRight:6}}>
                            <FontAwesomeIcon icon={faTrashAlt} size={32} color="#555"/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { /*Report*/ }} style={{marginRight:6}}>
                            <FontAwesomeIcon icon={faExclamationTriangle} size={32} color="#f66"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <Seperator />
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
    },
    profilepicture: {
        width: 64,
        height: 64,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#000",
        backgroundColor: BLACK
    },
    row: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "flex-start",
    },
});
