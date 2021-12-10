import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCommentDots, faExclamationTriangle, faHeart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { StyleSheet, View, Image, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { BLACK, MAINCOLOR } from '../Constants/colors';
import { TextBlock } from '../Components/styledText';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';
import language from '../../language.json';
import { currentLanguage } from '../../App';

export default function Chats({ navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <TouchableOpacity style={[styles.row, { marginTop: 0, height: "100%" }]} onPress={() => { navigation.navigate('Chat') }}>
                    <View style={[styles.row, {width:"100%", marginLeft: 15, height: 60 }]}>
                        <TouchableOpacity onPress={() => { navigation.navigate('MyProfile') }}>
                            <Image style={styles.profilepicture}
                                source={{ uri: "https://puu.sh/IsTPQ/5d69029437.png" }}
                            />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 10, height: "100%", justifyContent: "space-between" }}>
                            <TextBlock>{language.PET.OWNER[currentLanguage]}: </TextBlock>
                            <TextBlock>{language.PET.NAME[currentLanguage]}: </TextBlock>
                            <TextBlock>{language.CHATS.LAST_MSG[currentLanguage]}: </TextBlock>
                        </View>
                        <TouchableOpacity onPress={() => { /* Delete */ }} style={{ marginLeft: "auto", alignSelf: "center", right: 20 }}>
                            <FontAwesomeIcon icon={faTrashAlt} size={32} color="#555" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <Seperator />
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
        backgroundColor: BLACK
    },
    row: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "flex-start",
    },
});