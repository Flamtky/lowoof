import * as React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image, ScrollView, createElement } from 'react-native';
import { BACKGROUNDCOLOR, BLUE, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { TextBlock } from '../Components/styledText';
import Seperator from '../Components/seperator';
import SearchBar from '../Components/searchbar';
import ImagePickerField from '../Components/ImagePicker';
import OwnButton from '../Components/ownButton';
import { Pet } from '../Api/interfaces';
import { Api } from '../Api/lowoof-api';
import { Platform } from 'expo-modules-core';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';


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
    const [showDatePicker, setShowDatePicker] = React.useState(false);

    const addPet = () => {
        const newPet: Pet = {
            TIERID: 0,
            USERID: (props.route.params.api as Api).getCurrentUser()?.USERID ?? 0,
            NAME: petName,
            ART: petType,
            RASSE: petBreed,
            GESCHLECHT: petGender.charAt(0).toUpperCase() + petGender.slice(1).toLowerCase(),
            GEBURTSTAG: petBirthDate,
            PROFILBILD: petProfilePic
        };

        if (newPet.NAME === "" || newPet.ART === "" || newPet.RASSE === "") {
            alert(language.ERROR.NAME_SPECIES_BREED[currentLanguage]);
        } else if (['male', 'female', 'other'].indexOf(petGender.trim().toLowerCase().replace("diverse", "other")) < 0) {
            alert(language.ERROR.INV_GENDER[currentLanguage])
        } else if (petBirthDate.trim().length !== 10) {
            alert(language.ERROR.INV_BIRTHDATE[currentLanguage]);
        } else {
            (props.route.params.api as Api).createPetProfile(newPet).then((resp) => {
                if (resp.status === 413) {
                    alert(language.ERROR.IMG_TOO_BIG[currentLanguage]);
                } else if (resp.status !== 200) {
                    alert(language.ERROR.CREATE_PET_ERR[currentLanguage]);
                    console.log(resp);
                } else {
                    props.navigation.navigate('MyProfile');
                }
            });
        }
    }

    const formatDate = (date: string) => {
        if (date.length === 10) {
            return date.substring(8, 10) + "." + date.substring(5, 7) + "." + date.substring(0, 4);
        }
        return date;
    }


    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <ScrollView style={[isLargeScreen ? { width: '43%', left: "28%" } : null, { height: "100%", backgroundColor: MAINCOLOR }]}>
                <View style={{ backgroundColor: MAINCOLOR, height: "auto" }}>
                    <View style={styles.inputContainer}>
                        <TextBlock style={styles.title}>{language.PROFILE.ADDPET[currentLanguage]}</TextBlock>
                        <Seperator />
                        <SearchBar style={styles.input} placeholder={language.PET.NAME[currentLanguage]} value={petName} onChange={(event: any) => { setPetName(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PET.SPECIES[currentLanguage]} value={petType} onChange={(event: any) => { setPetType(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PET.BREED[currentLanguage]} value={petBreed} onChange={(event: any) => { setPetBreed(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PET.GENDER[currentLanguage] + " (Male, Female, Other)"} value={petGender} onChange={(event: any) => { setPetGender(event.nativeEvent.text); }} />
                        {Platform.OS === "web" ?
                            createElement('input', { style: { background: "#f5f5f5", borderWidth: 0, color: "#333", fontFamily: "arial", paddingLeft: 9, overflow: "hidden", marginBottom: 5, width: 272, height: 28, fontSize: 16 }, type: 'date', value: petBirthDate, onChange: (event: any) => { setPetBirthDate(event.target.value); } })
                            :
                            <View style={{ flexDirection: 'row', width: "auto" }}>
                                <SearchBar editable={false} style={[styles.input, { width: 50, flexGrow: 1 }]} placeholder={language.PET.BIRTHDAY[currentLanguage]} value={formatDate(petBirthDate)} onChange={(event: any) => { setPetBirthDate(event.nativeEvent.text); }} />
                                <TouchableOpacity style={{ marginTop: 4 }} onPress={() => { setShowDatePicker(true) }}>
                                    <FontAwesomeIcon icon={faCalendar} size={24} color={BLUE} />
                                </TouchableOpacity>
                                {showDatePicker ?
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={new Date()}
                                        is24Hour={true}
                                        display="default"
                                        onChange={(event: any, date: Date | undefined) => {
                                            if (event.type === "set" && date) {
                                                setPetBirthDate(date.toISOString().substring(0, 10));
                                            }
                                            setShowDatePicker(false);
                                        }} />
                                    : null}
                            </View>
                        }
                        <View style={{ flexDirection: "row", width: "100%", marginBottom: 5, backgroundColor: "#f5f5f5" }}>
                            <ImagePickerField showPreview={false} onChange={setPetProfilePic} title={language.PROFILE.PIC_PICK[currentLanguage]} />
                            {petProfilePic !== '' ? <Image source={{ uri: petProfilePic }} style={{ width: 35, height: 35, alignSelf: "center" }} /> : null}
                        </View>
                    </View>
                    <OwnButton
                        title={language.EDIT_PET.CREATE_PET[currentLanguage]}
                        style={{ width: "auto", padding: 0, minWidth: 0, borderRadius: 0, alignSelf: "center", marginTop: 5, paddingBottom: 20 }}
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
        height: 32,
        width: "100%",
        flexGrow: 1,
        borderRadius: 0,
        alignSelf: 'center',
        marginBottom: 5,
        zIndex: -1
    },
    inputContainer: {
        width: 300,
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        paddingVertical: 5,
        alignSelf: "center",
    }
});