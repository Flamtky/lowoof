import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEdit, faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView, Image, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextBlock } from '../Components/styledText';
import { MAINCOLOR, TITLECOLOR } from '../Constants/colors';
import Seperator from '../Components/seperator';

export default function MeinProfil() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={[styles.item, styles.container, isLargeScreen ? {width: '60%'} : {width: "100%"}]}>
            <ScrollView style={{width: '100%'}}
            keyboardDismissMode = "on-drag"
            >
                <View style={styles.innerContainer}>
                    <View style={styles.row}>
                        <Image style={styles.profilepicture}
                        source={{uri: "https://puu.sh/IsTPQ/5d69029437.png"}}
                        />
                        <TouchableOpacity onPress = {() => {/*TODO: Show Edit page*/}} style={{marginLeft: 30}}>
                            <FontAwesomeIcon icon = {faUserEdit} size = {40}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.column}>
                        <TextBlock>Benutzername: </TextBlock>
                        <TextBlock>Nachname, Vorname: </TextBlock>
                    </View>
                    <View style={styles.row}>
                        <View style={{width: "50%"}}>
                            <TextBlock>PLZ, Ort: </TextBlock>
                            <TextBlock>Geschlecht: </TextBlock>
                            <TextBlock>Geburtsdatum: </TextBlock>
                        </View>
                        <View style={{width: "50%"}}>
                            <TextBlock>Email: </TextBlock>
                            <TextBlock>Telefonnummer: </TextBlock>
                        </View>
                    </View>
                    <Seperator/>
                    <TextBlock style={{fontSize: 24, color: TITLECOLOR, fontWeight: "bold", alignSelf: "center"}}>Eigene Haustiere</TextBlock>
                    <Seperator/>
                    <View style = {styles.row}>
                        <TouchableOpacity onPress = {() => {/*TODO: Show Tierprofil*/}} >
                            <Image style={styles.petpicture}
                            source={{uri: "https://puu.sh/IsTPQ/5d69029437.png"}}
                            />
                        </TouchableOpacity>
                        <View style = {{marginLeft: 10}}>
                            <TextBlock>Matches: </TextBlock>
                            <TextBlock>Rufname: </TextBlock>
                            <TextBlock>Art: </TextBlock>
                            <TextBlock>Rasse: </TextBlock>
                        </View>
                        <TouchableOpacity onPress = {() => {/*TODO: Show Edit page*/}} style = {{marginLeft: 30}}>
                            <FontAwesomeIcon icon = {faUserEdit} size = {40}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {() => {/*TODO: Delete*/}} style = {{marginLeft: 10}}>
                            <FontAwesomeIcon icon = {faTrashAlt} size = {40}/>
                        </TouchableOpacity>
                    </View>
                    <Seperator/>
                    <View style={{width: 200, alignSelf: "center", marginTop: 20}}>
                        <Button title="Neues Tierprofil anlegen" onPress = {() => {/*Tierprofil anlegen*/}}/>
                    </View>
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
       flex:1,
    },
    profilepicture: {
        width: 128,
        height: 128,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#000",
        backgroundColor: "#fff"
    },
    petpicture: {
        width: 64,
        height: 64,
        borderWidth: 1.5,
        borderRadius: 10,
        borderColor: "#333",
        backgroundColor: "#fff"
    },
    row: {
        marginTop: 10,
        flexDirection: "row",
        width: "100%",
        alignItems: "flex-start",
    },
    column: {
        marginTop: 10,
        flexDirection: "column",
        alignItems: "flex-start",
    },
});