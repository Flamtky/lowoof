import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faCommentDots, faExclamationTriangle, faStar as fasStar, faHeart, faHeartBroken, faTrash, faClock } from "@fortawesome/free-solid-svg-icons"
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons"
import { StyleSheet, View, Image, TouchableOpacity } from "react-native"
import { BLACK, GRAY, MAINCOLOR } from "../Constants/colors"
import { TextBlock } from "./styledText"
import { Pet } from "../Api/interfaces"
import { Buffer } from "buffer"
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from "../Constants/api"

export default function PetItem(props: any) {
    const pet: Pet = props.pet; /* The pet to display */
    const ownPet: Pet | undefined = props.ownPet; /* The pet the user owns */

    const [hasChanged, setHasChanged] = React.useState(false);

    let isFriend = props.isFriend; /* Is this pet my friend? */
    let hasRequested = props.hasRequested; /* Has this pet requested to become my friend? */
    let hasOwnRequest = props.hasOwnRequest; /* Have I requested to become this pet's friend? */
    let isMarkedAttractive = props.isMarkedAttractive; /* Have I marked this pet as attractive? */
    let showWatchLater = props.showWatchLater ?? false; /* Should we show the watch later button? */
    let showRemoveWatchLater = props.showRemoveWatchLater ?? false; /* Should we show the remove watch later button? */
    let showAddToBlackList = props.showAddToBlackList ?? false; /* Should we show the add to black list button? */
    return (
        <View style={[styles.row, { marginLeft: 15, height: 80 }, hasChanged ? { display: "none" } : null]}>
            <TouchableOpacity onPress={() => { props.navigation.navigate('PetProfile', { petID: pet.TIERID }); }} >
                <Image style={styles.profilepicture}
                    source={{ uri: pet.PROFILBILD != null ? Buffer.from(pet.PROFILBILD, 'base64').toString('ascii') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                />
            </TouchableOpacity>
            <View style={{ marginLeft: 10, height: 64, justifyContent: "space-between" }}>
                <TouchableOpacity style={pet.USERNAME !== undefined ? null : { display: "none" }} onPress={() => { props.navigation.navigate('MyProfile', { userID: pet.USERID }) }}>
                    <TextBlock style={{ color: "#00f" }}>{language.PET.OWNER[currentLanguage]}: {pet.USERNAME}</TextBlock>
                </TouchableOpacity>
                <TextBlock>{language.PET.NAME[currentLanguage]}: {pet.NAME}</TextBlock>
                <TextBlock>{language.PET.SPECIES[currentLanguage]}: {pet.ART}</TextBlock>
                <TextBlock>{language.PET.BREED[currentLanguage]}: {pet.RASSE}</TextBlock>
            </View>
            <View style={[styles.row, { marginLeft: "auto", right: "5%" }]}>
                <TouchableOpacity onPress={() => {
                    API.acceptFriendRequest(props.petID, pet.TIERID).then((resp: any) => {
                        if (resp.status === 200) {
                            setHasChanged(true);
                        } else if (resp.message === "Relationship not Found") {
                            API.sendFriendRequest(props.petID, pet.TIERID).then((resp2: any) => {
                                if (resp2.status === 200) {
                                    setHasChanged(true);
                                } else {
                                    alert(resp2.message);
                                    console.log(resp2);
                                }
                            });
                        } else {
                            alert(resp.message);
                            console.log(resp);
                        }
                    })
                }} style={[{ marginRight: 6 }, (!isFriend && !hasOwnRequest) || hasRequested ? null : { display: "none" }]}>
                    <FontAwesomeIcon icon={faHeart} size={32} color="#f00" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    API.removeFriend(props.petID, pet.TIERID).then((resp: any) => {
                        if (resp.status === 200) {
                            setHasChanged(true);
                        } else {
                            alert(resp.message);
                        }
                    })
                }} style={[{ marginRight: 6 }, (isFriend || hasOwnRequest) || hasRequested ? null : { display: "none" }]}>
                    <FontAwesomeIcon icon={faHeartBroken} size={32} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    API.sendAttraktivRequest(props.petID, pet.TIERID).then((resp: any) => {
                        if (resp.status === 200) {
                            setHasChanged(true);
                        } else {
                            alert(resp.message);
                        }
                    })
                }} style={[{ marginRight: 6 }, isMarkedAttractive ? { display: "none" } : null]}>
                    <FontAwesomeIcon icon={fasStar} size={32} color="#fc5" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    API.removeAttraktivRequest(props.petID, pet.TIERID).then((resp: any) => {
                        if (resp.status === 200) {
                            setHasChanged(true);
                        } else {
                            alert(resp.message);
                        }
                    })
                }} style={[{ marginRight: 6 }, isMarkedAttractive ? null : { display: "none" }]}>
                    <FontAwesomeIcon icon={farStar} size={32} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { props.navigation.navigate('Chat', { ownPet: props.petID, targetPet: pet.TIERID }); }} style={{ marginRight: 6 }}>
                    <FontAwesomeIcon icon={faCommentDots} size={32} color="#0a0" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { props.navigation.navigate('Report', { petToReport: pet }); }} style={{ marginRight: 6 }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} size={32} color="#f66" />
                </TouchableOpacity>
                {showWatchLater ?
                    <TouchableOpacity onPress={() => { API.addWatchlater(ownPet?.TIERID ?? 0, pet.TIERID).then(() => setHasChanged(true)) }} style={{ marginRight: 6 }}>
                        <FontAwesomeIcon icon={faClock} size={32} color={GRAY} />
                    </TouchableOpacity>
                    : null}
                {showRemoveWatchLater ?
                    <TouchableOpacity onPress={() => { API.removeWatchlater(ownPet?.TIERID ?? 0, pet.TIERID).then(() => setHasChanged(true)) }} style={{ marginRight: 6 }}>
                        <FontAwesomeIcon icon={faTrash} size={32} color={GRAY} />
                    </TouchableOpacity>
                    : null}
                {showAddToBlackList && ownPet != null ?
                    <TouchableOpacity onPress={() => { API.addToSearchBlacklist(ownPet.TIERID, pet.TIERID).then(() => setHasChanged(true)) }} style={{ marginRight: 6 }}>
                        <FontAwesomeIcon icon={faTrash} size={32} color={GRAY} />
                    </TouchableOpacity>
                    : null}
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