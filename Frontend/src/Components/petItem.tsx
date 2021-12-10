import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faCommentDots, faExclamationTriangle, faStar as fasStar, faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons"
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons"
import { StyleSheet, View, Image, TouchableOpacity } from "react-native"
import { BLACK, MAINCOLOR } from "../Constants/colors"
import { TextBlock } from "./styledText"
import { Pet } from "../Api/interfaces"
import { Buffer } from "buffer"
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';

export default function PetItem(props: any) {
    const pet: Pet = props.pet; /* The pet to display */
    const isFriend = props.isFriend; /* Is this pet my friend? */
    const hasRequested = props.hasRequested; /* Has this pet requested to become my friend? */
    const hasOwnRequest = props.hasOwnRequest; /* Have I requested to become this pet's friend? */
    const isMarkedAttractive = props.isMarkedAttractive; /* Have I marked this pet as attractive? */
    return (<View style={[styles.row, { marginLeft: 15, height: 70 }]}>
        <TouchableOpacity onPress={() => {/* Show profile */ }} >
            <Image style={styles.profilepicture}
                source={{ uri: pet.PROFILBILD != null ? "data:image/png;base64," + Buffer.from(pet.PROFILBILD, 'base64').toString('base64') : "https://puu.sh/IsTPQ/5d69029437.png" }}
            />
        </TouchableOpacity>
        <View style={{ marginLeft: 10, height: 20, justifyContent: "space-between" }}>
            <TextBlock>{language.PET.OWNER[currentLanguage]}: {pet.USERID /* TODO: Get Owner */}</TextBlock>
            <TextBlock>{language.PET.NAME[currentLanguage]}: {pet.NAME}</TextBlock>
            <TextBlock>{language.PET.SPECIES[currentLanguage]}: {pet.ART}</TextBlock>
            <TextBlock>{language.PET.BREED[currentLanguage]}: {pet.RASSE}</TextBlock>
        </View>
        <View style={[styles.row, { marginLeft: "auto", right: "5%" }]}>
            <TouchableOpacity onPress={() => { /* Freundschaftsanfrage */ }} style={[{ marginRight: 6 }, (!isFriend && !hasOwnRequest) || hasRequested ? null : { display: "none" }]}>
                <FontAwesomeIcon icon={faHeart} size={32} color="#f00" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* Unfriend */ }} style={[{ marginRight: 6 }, (isFriend || hasOwnRequest) || hasRequested ? null : { display: "none" }]}>
                <FontAwesomeIcon icon={faHeartBroken} size={32} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* Attraktiv bewerten */ }} style={[{ marginRight: 6 }, isMarkedAttractive ? { display: "none" } : null]}>
                <FontAwesomeIcon icon={fasStar} size={32} color="#fc5" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* Unattraktiv bewerten */ }} style={[{ marginRight: 6 }, isMarkedAttractive ? null : { display: "none" }]}>
                <FontAwesomeIcon icon={farStar} size={32} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* Chat öffnen */ }} style={{ marginRight: 6 }}>
                <FontAwesomeIcon icon={faCommentDots} size={32} color="#0a0" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* Report */ }} style={{ marginRight: 6 }}>
                <FontAwesomeIcon icon={faExclamationTriangle} size={32} color="#f66" />
            </TouchableOpacity>
        </View>
    </View>)
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