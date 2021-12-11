import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCommentDots, faExclamationTriangle, faHeart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { StyleSheet, View, Image, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { BLACK, MAINCOLOR } from '../Constants/colors';
import { TextBlock } from '../Components/styledText';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { Pet } from '../Api/interfaces';
import { API } from '../Constants/api';

export default function Chats({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [pets, setPets] = React.useState<Pet[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
        API.getChats(route.params?.pet?.TIERID).then((res: any) => {
            if (!res.hasOwnProperty("message")) {
                setPets(res as Pet[]);
                setIsLoading(false);
            } else if ((res as Response).status === 404) {
                setIsLoading(false);
            } else if ((res as Response).status === 403) {
                alert(res.message);
                navigation.goBack();
            } else {
                console.log(res);
            }
        });
    }, [route]);

    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.MATCHES.HEADER[currentLanguage]}:</TextBlock>
                <Seperator />

                {!isLoading && pets.length === 0 && <TextBlock style={{ textAlign: 'center', marginTop: 20 }}> Keine Chats!</TextBlock>}
                {pets.map((pet: Pet, index: number) => {
                    return (
                        <ChatItem
                            key={index}
                            pet={pet}
                            navigation={navigation}
                            ownID={route.params?.pet?.TIERID}
                        />
                    );
                })}
            </ScrollView>
            <OwnButton title={language.BACK[currentLanguage]} style={{ margin: 32, alignSelf: "flex-start" }} onPress={() => {
                navigation.goBack();
            }} />
        </View>
    );
}

export function ChatItem(props: any) {
    const pet: Pet = props.pet; /* The pet to display */
    return (
        <>
            <TouchableOpacity style={[styles.row, { marginTop: 0, height: 60 }]} onPress={() => { props.navigation.navigate('Chat', {targetPet: pet.TIERID, ownPet: props.ownID, navigation: props.navigation}) }}>
                <View style={[styles.row, { width: "100%", marginLeft: 15, marginTop: 0 }]}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('PetProfile', {petID: pet.TIERID})}}>
                        <Image style={styles.profilepicture}
                            source={{ uri: pet.PROFILBILD != null ? Buffer.from(pet.PROFILBILD, 'base64').toString('ascii') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                        />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 10, height: 60, justifyContent: "space-between" }}>
                        <TextBlock>{language.PET.OWNER[currentLanguage]}: {pet.USERNAME}</TextBlock>
                        <TextBlock>{language.PET.NAME[currentLanguage]}: {pet.NAME}</TextBlock>
                        <TextBlock>{language.CHATS.LAST_MSG[currentLanguage]}: </TextBlock>
                    </View>
                    <TouchableOpacity onPress={() => { API.deleteChat(props.ownID, pet.TIERID) }} style={{ marginLeft: "auto", alignSelf: "center", right: 20 }}>
                        <FontAwesomeIcon icon={faTrashAlt} size={32} color="#555" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <Seperator />
        </>
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