import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrashAlt, faUserEdit } from '@fortawesome/free-solid-svg-icons';
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
import { currentLanguage } from '../../App';
import { API } from '../../App';

export default function Profile({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [profile, setProfile] = React.useState<User | null>(null);
    const [pets, setPets] = React.useState<Pet[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const api:Api = API;
    React.useEffect(() => {
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
            }
            // TODO: Handle error / show error page
        });
    }, [route]);

    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <View style={[styles.innerContainer, isLoading ? { display: "none" } : null]}>
                    <View style={styles.row}>
                        <Image style={styles.profilepicture}
                            source={{ uri: profile?.PROFILBILD != null ? "data:image/png;base64," + Buffer.from(profile.PROFILBILD, 'base64').toString('base64') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                        />
                        <View style={{ position: "absolute", right: "10%" }}>
                            <TouchableOpacity onPress={() => { navigation.navigate("EditProfile") }} >
                                <FontAwesomeIcon icon={faUserEdit} size={40} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.column}>
                        <TextBlock>{profile?.USERNAME ?? "<Username>"}</TextBlock>
                        <TextBlock>{profile?.NACHNAME ?? "<Last Name>"}, {profile?.VORNAME ?? "<First Name>"} </TextBlock>
                    </View>
                    <View style={styles.row}>
                        <View style={{ width: "50%" }}>
                            <TextBlock>{profile?.PLZ ?? "<Zip Code>"}, {profile?.WOHNORT ?? "<City>"} </TextBlock>
                            <TextBlock>{profile?.GESCHLECHT ?? "<Gender>"} </TextBlock>
                            <TextBlock>{moment(profile?.GEBURTSTAG).format("MM/DD/YYYY") ?? "<Date Of Birth>"} </TextBlock>
                        </View>
                        <View style={{ width: "50%" }}>
                            <TextBlock>{profile?.EMAIL ?? "<E-Mail>"}</TextBlock>
                            <TextBlock>{profile?.TELEFONNUMMER ?? "<Phone Number>"} </TextBlock>
                        </View>
                    </View>
                    <Seperator />
                    <TextBlock style={[styles.title, pets.length <= 0 ? { display: "none" } : null]}>{language.PROFILE.YOURPETS[currentLanguage]}</TextBlock>
                    {pets.map((pet: Pet) => {
                        return (
                            <PetItem
                                pet={pet}
                                navigation={navigation}
                                onPic={() => { navigation.navigate('Tierprofil') }}
                                onEdit={() => { navigation.navigate('EditAnimal') }}
                                onDelete={() => {
                                    navigation.navigate('DeleteAnimal', { petToDelete: pet, api: api, navigation: navigation });
                                }}
                                key={pet.TIERID}
                            />)
                    })}
                    <OwnButton title={language.PROFILE.ADDPET[currentLanguage]} style={{
                        alignSelf: "center",
                    }} />
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
                        source={{ uri: pet?.PROFILBILD != null ? "data:image/png;base64," + Buffer.from(pet.PROFILBILD, 'base64').toString('base64') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                    />
                </TouchableOpacity>
                <View style={{ marginLeft: 10 }}>
                    <TextBlock>Matches: </TextBlock>
                    <TextBlock>{pet.NAME ?? "<Name>"}</TextBlock>
                    <TextBlock>{pet.ART ?? "<Species>"} </TextBlock>
                    <TextBlock>{pet.RASSE ?? "<Breet>"}</TextBlock>
                </View>
                <View style={[styles.row, { marginLeft: "auto", right: "10%" }]}>
                    <TouchableOpacity onPress={props.onEdit}>
                        <FontAwesomeIcon icon={faUserEdit} size={40} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={props.onDelete}>
                        <FontAwesomeIcon icon={faTrashAlt} size={40} color="#555" />
                    </TouchableOpacity>
                </View>
            </View>
            <Seperator />
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
