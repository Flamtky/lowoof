import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextBlock } from '../Components/styledText';
import { BLACK, GRAY, MAINCOLOR, TITLECOLOR } from '../Constants/colors';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';


export default function MeinProfil({navigation}:any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <View style={styles.innerContainer}>
                    <View style={styles.row}>
                        <Image style={styles.profilepicture}
                            source={{ uri: "https://puu.sh/IsTPQ/5d69029437.png" }}
                        />
                        <View style={{ position: "absolute", right: "10%" }}>
                            <TouchableOpacity onPress={() => {/*TODO: Show Edit page*/ }} >
                                <FontAwesomeIcon icon={faUserEdit} size={40} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.column}>
                        <TextBlock>Benutzername: </TextBlock>
                        <TextBlock>Nachname, Vorname: </TextBlock>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: "50%" }}>
                            <TextBlock>PLZ, Ort: </TextBlock>
                            <TextBlock>Geschlecht: </TextBlock>
                            <TextBlock>Geburtsdatum: </TextBlock>
                        </View>
                        <View style={{ width: "50%" }}>
                            <TextBlock>Email: </TextBlock>
                            <TextBlock>Telefonnummer: </TextBlock>
                        </View>
                    </View>
                    <Seperator />
                    <TextBlock style={styles.title}>Eigene Haustiere</TextBlock>
                    <Seperator />
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => {navigation.navigate('Tierprofil')}} >
                            <Image style={styles.petpicture}
                                source={{ uri: "https://puu.sh/IsTPQ/5d69029437.png" }}
                            />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 10 }}>
                            <TextBlock>Matches: </TextBlock>
                            <TextBlock>Rufname: </TextBlock>
                            <TextBlock>Art: </TextBlock>
                            <TextBlock>Rasse: </TextBlock>
                        </View>
                        <View style={[styles.row, { marginLeft: "auto", right: "10%" }]}>
                            <TouchableOpacity onPress={() => {/*TODO: Show Edit page*/ }}>
                                <FontAwesomeIcon icon={faUserEdit} size={40} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {/*TODO: Delete*/ }}>
                                <FontAwesomeIcon icon={faTrashAlt} size={40} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Seperator />
                    <OwnButton title="Neues Tier hinzufügen" />
                </View>
            </ScrollView>
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
