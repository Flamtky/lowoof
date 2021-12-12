import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt, faUserEdit, faUser, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextBlock } from '../Components/styledText';
import { BLACK, GRAY, MAINCOLOR, TITLECOLOR } from '../Constants/colors';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';
import { Api } from '../Api/lowoof-api';
import { User, Pet } from '../Api/interfaces';
import moment from 'moment';
import { Buffer } from "buffer"
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';


export default function MyProfile({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [profile, setProfile] = React.useState<User | null>(null);
    const [pets, setPets] = React.useState<Pet[]>([]);
    const [ownProfile, setOwnProfile] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const api: Api = API;
    React.useEffect(() => {
        if (route.params.userID == undefined) {
            navigation.navigate('MyProfile', { userID: api.getCurrentUser()?.USERID });
        }
        setOwnProfile(route.params.userID === API.getCurrentUser()?.USERID);
        api.getProfileData(route.params.userID).then(data => {
            // If data has message as key, then the user does not exist or multiple users with the same username exist
            if (!data.hasOwnProperty("message")) {
                setProfile(data as User);
                api.getUserPets(route.params.userID).then(data => {
                    if (!data.hasOwnProperty("message")) {
                        setPets(data as Pet[]);
                    }
                    setIsLoading(false);
                });
            } else {
                console.log(data);
            }

        });
    }, [route]);

    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <View style={[styles.innerContainer, isLoading ? { display: "none" } : null]}>
                    {!ownProfile ?
                        <OwnButton title={language.PROFILE.BACK_TO_PROFILE[currentLanguage]} style={{ width: "90%", alignSelf: "center", heigth: 48 }} onPress={() => navigation.navigate('MyProfile', { userID: API.getCurrentUser()?.USERID })} />
                        : null}
                    <View style={styles.row}>
                        <Image style={styles.profilepicture}
                            source={{ uri: profile?.PROFILBILD != null ? Buffer.from(profile.PROFILBILD, 'base64').toString('ascii') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                        />
                        {profile?.ONLINESTATUS == 1 ?
                            <FontAwesomeIcon icon={faUser} color="#0d0" size={20} style={{ margin: 10 }} />
                            : <FontAwesomeIcon icon={faUserSlash} color="#f00" size={23} style={{ margin: 10 }} />}
                        {ownProfile ?
                            <View style={{ position: "absolute", right: "10%" }}>
                                <TouchableOpacity onPress={() => { navigation.navigate("EditProfile") }} >
                                    <FontAwesomeIcon icon={faUserEdit} size={40} />
                                </TouchableOpacity>
                            </View>
                            : null}
                    </View>
                    <View style={styles.column}>
                        <TextBlock>{language.PROFILE.USERNAME[currentLanguage]}: {profile?.USERNAME ?? "<Username>"}</TextBlock>
                        <TextBlock>{language.PROFILE.NAME[currentLanguage]}: {profile?.NACHNAME ?? "<Last Name>"}, {profile?.VORNAME ?? "<First Name>"} </TextBlock>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: "50%" }}>
                            <TextBlock>{language.PROFILE.ADDRESS[currentLanguage]}: {profile?.PLZ ?? "<Zip Code>"}, {profile?.WOHNORT ?? "<City>"} </TextBlock>
                            <TextBlock>{language.PROFILE.GENDER[currentLanguage]}: {profile?.GESCHLECHT ?? "<Gender>"} </TextBlock>
                            <TextBlock>{language.PROFILE.BIRTHDAY[currentLanguage]}: {moment(profile?.GEBURTSTAG).format("DD.MM.YYYY") ?? "<Date Of Birth>"} </TextBlock>
                        </View>
                        <View style={{ width: "50%" }}>
                            <TextBlock>{language.PROFILE.EMAIL[currentLanguage]}: {profile?.EMAIL ?? "<E-Mail>"}</TextBlock>
                            <TextBlock>{language.PROFILE.PHONE[currentLanguage]}: {profile?.TELEFONNUMMER ?? "<Phone Number>"} </TextBlock>
                            <TextBlock>{language.PROFILE.INSTITUTION[currentLanguage]}: {profile?.INSTITUTION ?? "<Institution>"} </TextBlock>

                        </View>
                    </View>
                    <Seperator />
                    <TextBlock style={[styles.title, pets.length <= 0 ? { display: "none" } : null]}>
                        {ownProfile ? language.PROFILE.YOURPETS[currentLanguage] : language.PROFILE.PETS_OF[currentLanguage] + profile?.USERNAME ?? "<User>"}
                    </TextBlock>
                    {pets.map((pet: Pet) => {
                        return (
                            <PetItem
                                pet={pet}
                                navigation={navigation}
                                owned={ownProfile}
                                onPic={() => { navigation.navigate('PetProfile', { petID: pet.TIERID }) }}
                                onEdit={() => { navigation.navigate('EditPet', { petID: pet.TIERID }) }}
                                onDelete={() => {
                                    navigation.navigate('DeletePet', { petToDelete: pet, api: api, navigation: navigation });
                                }}
                                key={pet.TIERID}
                            />)
                    })}
                    {ownProfile ?
                        <>
                            <Seperator />
                            <OwnButton
                                title={language.PROFILE.ADDPET[currentLanguage]}
                                style={{ alignSelf: "center" }}
                                onPress={() => {
                                    navigation.navigate('AddPet', { api: api, navigation: navigation });
                                }}
                            />
                        </>
                        : null}
                </View>
            </ScrollView>
        </View>
    );
}

function PetItem(props: any) {
    const pet: Pet = props.pet;
    return (
        <View>
            <Seperator />
            <View style={styles.row}>
                <TouchableOpacity onPress={props.onPic} >
                    <Image style={styles.petpicture}
                        source={{ uri: pet?.PROFILBILD != null ? Buffer.from(pet.PROFILBILD, 'base64').toString('ascii') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                    />
                </TouchableOpacity>
                <View style={{ marginLeft: 10 }}>
                    <TextBlock>{language.PET.NAME[currentLanguage]}: {pet.NAME ?? "<Name>"}</TextBlock>
                    <TextBlock>{language.PET.SPECIES[currentLanguage]}: {pet.ART ?? "<Species>"} </TextBlock>
                    <TextBlock>{language.PET.BREED[currentLanguage]}: {pet.RASSE ?? "<Breed>"}</TextBlock>
                </View>
                {props.owned ?
                    <View style={[styles.row, { marginTop: 0, marginLeft: "auto", right: "10%" }]}>
                        <TouchableOpacity onPress={props.onEdit}>
                            <FontAwesomeIcon icon={faUserEdit} size={40} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={props.onDelete}>
                            <FontAwesomeIcon icon={faTrashAlt} size={40} color="#555" />
                        </TouchableOpacity>
                    </View>
                    : null}
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
