import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView, Image, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextBlock } from '../Components/styledText';
import { BLACK, GRAY, MAINCOLOR, TITLECOLOR } from '../Constants/colors';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';
import { Pet, User } from '../Api/interfaces';
import { Api } from '../Api/lowoof-api';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';


export default function PetProfile({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [petProfile, setPetProfile] = React.useState<Pet | null>(null);
    const [ownerProfile, setOwnerProfile] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const api: Api = API;

    React.useEffect(() => {
        if (route.params?.petID == null) {
            navigation.navigate('MyProfile');
        } else {
            api.getPetData(route.params.petID).then(data => {
                if (!data.hasOwnProperty("message")) {
                    setPetProfile(data as Pet);
                    api.getProfileData((data as Pet).USERID).then(data => {
                        if (!data.hasOwnProperty("message")) {
                            setOwnerProfile(data as User);
                        }
                        setIsLoading(false);
                    });
                } else {
                    navigation.navigate('MyProfile');
                }
            });
        }
    }, [route]);

    return (
        <View style={{width:"100%",height:"100%", backgroundColor: MAINCOLOR}}>
            <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%', marginLeft: "20%" } : { width: "100%" }]}>
                <ScrollView style={{ width: '100%' }}
                    keyboardDismissMode="on-drag"
                >
                    <View style={[styles.innerContainer, { height: dimensions.height }, isLoading ? { display: "none" } : null]}>
                        <View style={styles.row}>
                            <Image style={styles.petpicture}
                                source={{ uri: petProfile?.PROFILBILD != null ? "data:image/png;base64," + Buffer.from(petProfile.PROFILBILD, 'base64').toString('base64') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                            />
                            <View style={[styles.row, { position: "absolute", right: "10%" }]}>
                                <TouchableOpacity onPress={() => { navigation.navigate('EditPet') }} >
                                    <FontAwesomeIcon icon={faUserEdit} size={40} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { alert("Tier gelöscht!")/*TODO: Delete*/ }} >
                                    <FontAwesomeIcon icon={faTrashAlt} size={40} color="#555" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={{ width: "50%" }}>
                                <TextBlock>{language.PET.NAME[currentLanguage]}: {petProfile?.NAME}</TextBlock>
                                <TextBlock>{language.PET.OWNER[currentLanguage]}: {ownerProfile?.USERNAME}</TextBlock>
                                <TextBlock> </TextBlock>
                                <TextBlock>{language.PET.GENDER[currentLanguage]}: {petProfile?.GESCHLECHT}</TextBlock>
                                <TextBlock>{language.PET.BIRTHDAY[currentLanguage]}: {petProfile?.GEBURTSTAG}</TextBlock>
                                <TextBlock> </TextBlock>
                                <TextBlock>{language.PET.SPECIES[currentLanguage]}: {petProfile?.ART} </TextBlock>
                                <TextBlock>{language.PET.BREED[currentLanguage]}: {petProfile?.RASSE} </TextBlock>
                                <TextBlock>{language.PET.DESCRIPTION[currentLanguage]}: </TextBlock>
                                <TextBlock>Text... </TextBlock>
                                <TextBlock>Text... </TextBlock>
                            </View>
                            <View style={{ width: "50%" }}>
                                <TextBlock> </TextBlock>
                                <TextBlock>{language.PET.PREFERENCES[currentLanguage]}: </TextBlock>
                                <TextBlock> </TextBlock>
                                <TextBlock>{language.PET.DISTANCE[currentLanguage]}: </TextBlock>
                                <TextBlock>{language.PET.GENDER[currentLanguage]}: </TextBlock>
                                <TextBlock>{language.PET.AGE[currentLanguage]}: </TextBlock>
                                <TextBlock> </TextBlock>
                                <TextBlock>{language.PET.FEATURES[currentLanguage]}</TextBlock>
                                <TextBlock>Text... </TextBlock>
                                <TextBlock>Text... </TextBlock>
                            </View>
                        </View>
                        <Seperator />
                        <View style={[styles.row, { marginVertical: 10, justifyContent: "space-around" }]}>
                            <OwnButton title={language.MATCHES.HEADER[currentLanguage]} onPress={() => {
                                navigation.navigate('Matches');
                            }} />
                            <OwnButton title={language.FRIENDS.HEADER[currentLanguage]} onPress={() => {
                                navigation.navigate('Friends');
                            }} />
                            <OwnButton title={language.CHATS.HEADER[currentLanguage]} onPress={() => {
                                navigation.navigate('Chats');
                            }} />
                        </View>
                        <Seperator />
                    </View>
                </ScrollView>
                <OwnButton title={language.BACK[currentLanguage]} style={{ margin: 32, alignSelf: "flex-start" }} onPress={() => {
                    navigation.goBack();
                }} />
            </View>
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
