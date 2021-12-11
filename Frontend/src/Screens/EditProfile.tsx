import * as React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image, ScrollView } from 'react-native';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { TextBlock } from '../Components/styledText';
import Seperator from '../Components/seperator';
import SearchBar from '../Components/searchbar';
import ImagePickerField from '../Components/ImagePicker';
import OwnButton from '../Components/ownButton';
import { Pet } from '../Api/interfaces';
import { Api } from '../Api/lowoof-api';


export function EditProfile() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : { width: "100%" }]}>
                <Text>{language.EDIT_PROFILE.HEADER[currentLanguage]}</Text>
            </View>
        </View>
    );
}

export function EditPet() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : { width: "100%" }]}>
                <Text>{language.EDIT_PET.HEADER[currentLanguage]}</Text>
            </View>
        </View>
    );
}

export function AddPet(props: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    const [petName, setPetName] = React.useState("");
    const [petType, setPetType] = React.useState("");
    const [petBreed, setPetBreed] = React.useState("");
    const [petGender, setPetGender] = React.useState("");
    const [petBirthDate, setPetBirthDate] = React.useState("");
    const [petProfilePic, setPetProfilePic] = React.useState("");

    const addPet = () => {
        const newPet: Pet = {
            TIERID: 0,
            USERID: (props.route.params.api as Api).getCurrentUser()?.USERID ?? 0,
            NAME: petName,
            ART: petType,
            RASSE: petBreed,
            GESCHLECHT: petGender,
            GEBURTSTAG: petBirthDate,
            PROFILBILD: Buffer.from(petProfilePic, 'base64')
        };
        if (newPet.NAME === "" || newPet.ART === "" || newPet.RASSE === "") {
            alert("Das Tier braucht einen Namen, einen Typ und eine Rasse!");
        } else if (['Male', 'Female', 'Other'].indexOf(petGender.trim()) >= 0) {
            alert(language.LOGIN.INV_GENDER[currentLanguage])
        } else if (petBirthDate.trim().length !== 10) {
            alert(language.LOGIN.INV_BIRTHDATE[currentLanguage]);
        } else {
            (props.api as Api).createPetProfile(newPet).then((resp) => {
                if (resp.status !== 200) {
                    alert("Fehler beim Erstellen des Tieres");
                    console.log(resp);
                }
            });
        }
    }

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <ScrollView style={[isLargeScreen ? { width: '43%', left: "28%" } : null, { height: "100%", backgroundColor: MAINCOLOR }]}>
                <View style={{ backgroundColor: MAINCOLOR, height: "100%" }}>
                    <View style={styles.inputContainer}>
                        <TextBlock style={styles.title}>Tier hinzufügen</TextBlock>
                        <Seperator />
                        <SearchBar style={styles.input} placeholder="Name" value={petName} onChange={(event: any) => { setPetName(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Typ" value={petType} onChange={(event: any) => { setPetType(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Rasse" value={petBreed} onChange={(event: any) => { setPetBreed(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Geschlecht" value={petGender} onChange={(event: any) => { setPetGender(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Geburtsdatum" value={petBirthDate} onChange={(event: any) => { setPetBirthDate(event.nativeEvent.text); }} />
                        <View style={{ flexDirection: "row", width: "100%", marginBottom: 5, backgroundColor: "#f5f5f5" }}>
                            <ImagePickerField showPreview={false} onChange={setPetProfilePic} title={language.PROFILE.PIC_PICK[currentLanguage]} />
                            {petProfilePic !== '' ? <Image source={{ uri: petProfilePic }} style={{ width: 35, height: 35, alignSelf: "center" }} /> : null}
                        </View>
                    </View>
                    <OwnButton
                        title="Tier anlegen"
                        style={{ width: 120, padding: 0, minWidth: 0, borderRadius: 0, alignSelf: "center", marginTop: 5, paddingBottom: 20 }}
                        onPress={addPet}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAINCOLOR,
        alignItems: 'center',
        height: "100%"
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        height: 24,
        width: "100%",
        flexGrow: 1,
        borderRadius: 0,
        alignSelf: 'center',
        marginBottom: 5,
        zIndex: -1
    },
    inputContainer: {
        width: 300,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        paddingVertical: 5,
        alignSelf: "center",
    }
});