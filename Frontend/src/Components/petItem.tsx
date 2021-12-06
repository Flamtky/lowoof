import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faCommentDots, faExclamationTriangle, faStar as fasStar, faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons"
import { faStar as farStar} from "@fortawesome/free-regular-svg-icons"
import { StyleSheet, View, Image, TouchableOpacity } from "react-native"
import { BLACK, MAINCOLOR } from "../Constants/colors"
import { TextBlock } from "./styledText"

export default function PetItem({navigation}:any, props: any) {
    /* TODO: Booleanwerte als Parameter übergeben */
    const isFriend = false; /* Is this pet my friend? */
    const hasRequested = false; /* Has this pet requested to become my friend? */
    const hasOwnRequest = false; /* Have I requested to become this pet's friend? */
    const isMarkedAttractive = true; /* Have I marked this pet as attractive? */
    return <View style={[styles.row, {marginLeft: 15, height: 60}]}>
    <TouchableOpacity onPress={() => { navigation.navigate('Mein Profil') }} >
        <Image style={styles.profilepicture}
            source={{ uri: "https://puu.sh/IsTPQ/5d69029437.png" /* TODO: Hier Link per Parameter angeben */ }}
        />
    </TouchableOpacity>
    <View style={{ marginLeft: 10, height: "100%", justifyContent: "space-between" /* TODO: In untenstehenden Textblocks Parameter für Daten übernehmen */}}>
        <TextBlock>Besitzer: </TextBlock>
        <TextBlock>Rufname: </TextBlock>
        <View style={[styles.row, {marginTop: 0}]}>
            <TextBlock>Art: </TextBlock>
            <TextBlock>Rasse: </TextBlock>
        </View>
    </View>
    <View style={[styles.row, { marginLeft: "auto", right: "5%" }]}>
        <TouchableOpacity onPress={() => { /* Freundschaftsanfrage */ }} style={[{marginRight:6}, (!isFriend && !hasOwnRequest) || hasRequested ? null : {display:"none"}]}>
            <FontAwesomeIcon icon={faHeart} size={32} color="#f00"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { alert("Tier aus Freundesliste entfernt")/* Unfriend */ }} style={[{marginRight:6}, (isFriend || hasOwnRequest) || hasRequested ? null : {display:"none"}]}>
            <FontAwesomeIcon icon={faHeartBroken} size={32} color="#555"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { /* Attraktiv bewerten */}} style={[{marginRight:6}, isMarkedAttractive ? {display:"none"} : null]}>
            <FontAwesomeIcon icon={fasStar} size={32} color="#fc5"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { /* Unattraktiv bewerten */}} style={[{marginRight:6}, isMarkedAttractive ? null : {display:"none"}]}>
            <FontAwesomeIcon icon={farStar} size={32} color="#555"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('Chat')/* Chat öffnen */ }} style={{marginRight:6}}>
            <FontAwesomeIcon icon={faCommentDots} size={32} color="#0a0"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { /* Report */ }} style={{marginRight:6}}>
            <FontAwesomeIcon icon={faExclamationTriangle} size={32} color="#f66"/>
        </TouchableOpacity>
    </View>
</View>
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