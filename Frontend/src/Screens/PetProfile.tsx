import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextBlock } from '../Components/styledText';
import { BLACK, GRAY, MAINCOLOR, TITLECOLOR } from '../Constants/colors';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';
import { Pet, Preference, User } from '../Api/interfaces';
import { Api } from '../Api/lowoof-api';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';
import { Buffer } from "buffer";
import moment from 'moment';



export default function PetProfile({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [petProfile, setPetProfile] = React.useState<Pet | null>(null);
    const [prefs, setPrefs] = React.useState<Preference[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [ownProfile, setOwnProfile] = React.useState<boolean>(false);
    const api: Api = API;

    React.useEffect(() => {
        if (route.params?.petID == null) {
            navigation.navigate('MyProfile');
        } else {
            api.getPetData(route.params.petID).then(data => {
                if (!data.hasOwnProperty("message")) {
                    setPetProfile(data as Pet);
                    setOwnProfile(API.getCurrentUser()?.USERID === (data as Pet).USERID);
                    api.getPreferences((data as Pet).TIERID).then(res => {
                        if (!res.hasOwnProperty("message")) {
                            setPrefs(res as Preference[]);
                        }
                        setIsLoading(false);
                    });
                } else {
                    navigation.navigate('MyProfile');
                }
            });
        }
    }, [route]);

    const calcAge = (isoDate: string) => {
        if (isoDate == null || isoDate.trim() === "") {
            return "";
        }
        let today = new Date();
        let birthDate = new Date(isoDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        let month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    return (
        <View style={{ width: "100%", height: "100%", backgroundColor: MAINCOLOR }}>
            <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%', marginLeft: "20%" } : { width: "100%" }]}>
                <ScrollView style={{ width: '100%' }}
                    keyboardDismissMode="on-drag"
                >
                    <View style={[styles.innerContainer, { height: dimensions.height }, isLoading ? { display: "none" } : null]}>
                        <View style={styles.row}>
                            <Image style={styles.petpicture}
                                source={{ uri: petProfile?.PROFILBILD != null ? Buffer.from(petProfile.PROFILBILD, 'base64').toString('ascii') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                            />
                            {ownProfile || API.getCurrentUser()?.ADMIN ?
                                <View style={[styles.row, { position: "absolute", right: "10%" }]}>
                                    {ownProfile ?
                                        <TouchableOpacity onPress={() => { navigation.navigate('EditPet', { petToEdit: petProfile, api: api, navigation: navigation }); }} >
                                            <FontAwesomeIcon icon={faUserEdit} size={40} />
                                        </TouchableOpacity>
                                        : null}
                                    {ownProfile || API.getCurrentUser()?.ADMIN ?
                                        <TouchableOpacity onPress={() => { navigation.navigate('DeletePet', { petToDelete: petProfile, api: api, navigation: navigation }); }} >
                                            <FontAwesomeIcon icon={faTrashAlt} size={40} color="#555" />
                                        </TouchableOpacity>
                                        : null}
                                </View>
                                : null}
                        </View>
                        <View style={styles.row}>
                            <View style={{ width: "50%" }}>
                                <TextBlock>{language.PET.NAME[currentLanguage]}: {petProfile?.NAME}</TextBlock>
                                <TouchableOpacity onPress={() => { navigation.navigate('MyProfile', { userID: petProfile?.USERID }) }}>
                                    <TextBlock style={{ color: "#00f" }}>{language.PET.OWNER[currentLanguage]}: {petProfile?.USERNAME}</TextBlock>
                                </TouchableOpacity>
                                <TextBlock> </TextBlock>
                                <TextBlock>{language.PET.GENDER[currentLanguage]}: {petProfile?.GESCHLECHT}</TextBlock>
                                <TextBlock>{language.PET.BIRTHDAY[currentLanguage]}: {moment(petProfile?.GEBURTSTAG).format("DD.MM.YYYY")}</TextBlock>
                                <TextBlock>{language.PET.AGE[currentLanguage]}:  {calcAge(petProfile?.GEBURTSTAG ?? "")}</TextBlock>
                            </View>
                            <View style={{ width: "50%" }}>
                                <TextBlock>{language.PET.SPECIES[currentLanguage]}: {petProfile?.ART} </TextBlock>
                                <TextBlock>{language.PET.BREED[currentLanguage]}: {petProfile?.RASSE} </TextBlock>
                                <TextBlock> </TextBlock>
                                {prefs.length > 0 ?
                                    <>
                                        <TextBlock>{language.PET.PREFERENCES[currentLanguage]}: </TextBlock>
                                        {prefs.map((pref, index) => {
                                            return (
                                                <TextBlock key={"petpref-"+index}>{index+1 + ": " + pref.PREF}</TextBlock>
                                            )
                                        })}
                                    </>
                                    : null
                                }
                            </View>
                        </View>
                        <Seperator />
                        {ownProfile ?
                            <>
                                <View style={[styles.row, { marginVertical: 10, justifyContent: "space-around" }]}>
                                    <OwnButton title={language.MATCHES.HEADER[currentLanguage]} onPress={() => {
                                        navigation.navigate('Matches', { petID: petProfile?.TIERID });
                                    }} />
                                    <OwnButton title={language.FRIENDS.HEADER[currentLanguage]} onPress={() => {
                                        navigation.navigate('Friends', { petID: petProfile?.TIERID });
                                    }} />
                                    <OwnButton title={language.CHATS.HEADER[currentLanguage]} onPress={() => {
                                        navigation.navigate('Chats', { pet: petProfile });
                                    }} />
                                </View>
                                <Seperator />
                            </>
                            : null}
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
