import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView, Image, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextBlock } from '../Components/styledText';
import { BLACK, GRAY, MAINCOLOR, TITLECOLOR } from '../Constants/colors';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';

export default function MeinProfil() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <View style={[styles.innerContainer, {height: dimensions.height}]}>
                    <View style={styles.row}>
                        <Image style={styles.profilepicture}
                            source={{ uri: "https://puu.sh/IsTPQ/5d69029437.png" }}
                        />
                        <View style={[styles.row, { position: "absolute", right: "10%" }]}>
                            <TouchableOpacity onPress={() => {/*TODO: Show Edit page*/ }} >
                                <FontAwesomeIcon icon={faUserEdit} size={40} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {/*TODO: Delete*/ }} >
                                <FontAwesomeIcon icon={faTrashAlt} size={40} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: "50%" }}>
                            <TextBlock>Rufname: </TextBlock>
                            <TextBlock>Besitzer: </TextBlock>
                            <TextBlock> </TextBlock>
                            <TextBlock>PLZ, Ort: </TextBlock>
                            <TextBlock>Geschlecht: </TextBlock>
                            <TextBlock>Geburtsdatum: </TextBlock>
                            <TextBlock> </TextBlock>
                            <TextBlock>Beschreibung: </TextBlock>
                            <TextBlock>Text... </TextBlock>
                            <TextBlock>Text... </TextBlock>
                            <TextBlock>Text... </TextBlock>
                        </View>
                        <View style={{ width: "50%" }}>
                            <TextBlock> </TextBlock>
                            <TextBlock>Präferenzen: </TextBlock>
                            <TextBlock> </TextBlock>
                            <TextBlock>Max. Entfernung: </TextBlock>
                            <TextBlock>Geschlecht: </TextBlock>
                            <TextBlock>Alter: </TextBlock>
                            <TextBlock> </TextBlock>
                            <TextBlock>Besondere Merkmale: </TextBlock>
                            <TextBlock>Text... </TextBlock>
                            <TextBlock>Text... </TextBlock>
                            <TextBlock>Text... </TextBlock>
                        </View>
                    </View>
                    <Seperator />
                    <View style={[styles.row, {marginVertical: 10, justifyContent:"space-around"}]}>
                        <OwnButton title="Matches"/>
                        <OwnButton title="Freunde"/>
                        <OwnButton title="Chats"/>
                    </View>
                    <Seperator/>
                    </View>
                </ScrollView>
            <OwnButton title="Zurück" style={{ margin: 32, alignSelf: "flex-start"}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAINCOLOR,
    },
    innerContainer: {
        margin: 32,
        flex: 1,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    profilepicture: {
        width: 128,
        height: 128,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#000",
        backgroundColor: BLACK
    },
    petpicture: {
        width: 64,
        height: 64,
        borderWidth: 1.5,
        borderRadius: 10,
        borderColor: GRAY,
        backgroundColor: BLACK
    },
    row: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "flex-start",
    },
    column: {
        marginTop: 10,
        flexDirection: "column",
        alignItems: "flex-start",
    },
    title: {
        fontSize: 24,
        color: TITLECOLOR,
        fontWeight: "bold",
        alignSelf: "center"
    },
});
