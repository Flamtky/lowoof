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
import { User } from '../Api/interfaces';
import moment from 'moment';
import { Buffer } from "buffer"


export default function Profile({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [profile, setProfile] = React.useState<User | null>(null);
    React.useEffect(() => {
        const api = new Api();
        api.getAuthTokenfromServer("application", "W*rx*TMn]:NuP|ywN`z8aUcHeTpL5<5,").then(() => {
            api.getProfileData(route.params.userID).then(data => {
                // If data has message as key, then the user does not exist or multiple users with the same username exist
                if (!data.hasOwnProperty("message")) {
                    setProfile(data as User);
                }
                // TODO: Handle error / show error page
            });
        });
    }, []);
    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <View style={styles.innerContainer}>
                    <View style={styles.row}>
                        <Image style={styles.profilepicture}
                            source={{ uri: profile?.PROFILBILD != null ? "data:image/png;base64," + Buffer.from(profile.PROFILBILD, 'base64').toString('base64'): "https://puu.sh/IsTPQ/5d69029437.png" }}
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
                    <TextBlock style={styles.title}>Your Pets</TextBlock>
                    <Seperator />
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => { navigation.navigate('Tierprofil') }} >
                            <Image style={styles.petpicture}
                                source={{ uri: "https://puu.sh/IsTPQ/5d69029437.png" }}
                            />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 10 }}>
                            <TextBlock>Matches: </TextBlock>
                            <TextBlock>Name: </TextBlock>
                            <TextBlock>Species: </TextBlock>
                            <TextBlock>Breed: </TextBlock>
                        </View>
                        <View style={[styles.row, { marginLeft: "auto", right: "10%" }]}>
                            <TouchableOpacity onPress={() => { navigation.navigate('EditAnimal') }}>
                                <FontAwesomeIcon icon={faUserEdit} size={40} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { alert("Tier gelöscht")/*TODO: Delete*/ }}>
                                <FontAwesomeIcon icon={faTrashAlt} size={40} color="#555" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Seperator />
                    <OwnButton title="Add Pet" style={{
                        alignSelf: "center",
                    }} />
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
