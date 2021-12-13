import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image, ScrollView, createElement } from 'react-native';
import { BACKGROUNDCOLOR, BLUE, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { TextBlock } from '../Components/styledText';
import Seperator from '../Components/seperator';
import SearchBar from '../Components/searchbar';
import ImagePickerField from '../Components/ImagePicker';
import OwnButton from '../Components/ownButton';
import { Pet, User } from '../Api/interfaces';
import { Api } from '../Api/lowoof-api';
import { API } from '../Constants/api';
import { Platform } from 'expo-modules-core';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Buffer } from 'buffer';


export function EditProfile({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const currentUser: User = route.params?.userToEdit ?? API.getCurrentUser();
    const [email, setEmail] = useState(currentUser.EMAIL);
    const [username, setUsername] = useState<string>(currentUser.USERNAME);
    const [surename, setSurename] = useState<string>(currentUser.NACHNAME);
    const [firstname, setFirstname] = useState<string>(currentUser.VORNAME);
    const [institution, setInstitution] = useState<string>(currentUser.INSTITUTION);
    const [gender, setGender] = useState<string>(currentUser.GESCHLECHT);
    const [profilePic, setProfilePic] = useState<string>(Buffer.from(currentUser.PROFILBILD, 'base64').toString('ascii'));
    const [birthdate, setBirthdate] = useState<string>(currentUser.GEBURTSTAG.substring(0, 10));
    const [zip, setZip] = useState<string>(String(currentUser.PLZ));
    const [city, setCity] = useState<string>(currentUser.WOHNORT);
    const [number, setNumber] = useState<string>(currentUser.TELEFONNUMMER);
    const [password, setPassword] = useState<string>(currentUser.PASSWORD ?? '');
    const [password2, setPassword2] = useState<string>('');

    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    const saveEdit = () => {
        API.isUsernameValid(username).then((res) => {
            if (!res && username != currentUser.USERNAME) {
                alert(language.ERROR.INV_USERNAME[currentLanguage]);
            } else if (username.trim().length < 3 || password.trim().length < 6 || username.trim().includes(' ') || password.trim().includes(' ')) {
                alert(language.ERROR.LOGIN_ERR[currentLanguage]);
            } else if (password !== password2) {
                alert(language.ERROR.NO_MATCH[currentLanguage]);
            } else if (email.trim().length < 5 || !email.trim().includes('@') || !email.trim().includes('.')) {
                alert(language.ERROR.INV_EMAIL[currentLanguage]);
            } else if (['Male', 'Female', 'Other'].indexOf(gender.trim()) < 0) {
                alert(language.ERROR.INV_GENDER[currentLanguage])
            } else if (birthdate.trim().length !== 10) {
                alert(language.ERROR.INV_BIRTHDATE[currentLanguage]);
            } else if (zip.trim().length !== 5 || isNaN(Number(zip))) {
                alert(language.ERROR.INV_ZIP[currentLanguage]);
            } else if (number.trim().length < 6 || isNaN(Number(number))) {
                alert(language.ERROR.INV_PHONE[currentLanguage]);
            } else {
                // new user
                const user: User = {
                    USERID: currentUser.USERID,
                    SPRACHID: currentLanguage === 'DE' ? '2' : '1', //TODO: CHECK THIS
                    USERNAME: username,
                    EMAIL: email,
                    PASSWORD: password,
                    VORNAME: firstname,
                    NACHNAME: surename,
                    GEBURTSTAG: birthdate,
                    INSTITUTION: institution,
                    TELEFONNUMMER: number,
                    PLZ: Number(zip),
                    WOHNORT: city,
                    GESCHLECHT: gender,
                    PROFILBILD: profilePic,
                    ONLINESTATUS: 1,
                    MITGLIEDSCHAFTPAUSIERT: 0,
                    ADMIN: 0
                };

                API.updateProfile(user).then((resp: any) => {
                    if (resp.status === 413) {
                        alert(language.ERROR.IMG_TOO_BIG[currentLanguage]);
                    } else if (resp.status !== 200) {
                        alert(language.ERROR.REG_ERR[currentLanguage]);
                        console.log(resp);
                    } else {
                        API.getAuthTokenfromServer(username, password).then((resp2: void | "Error") => {
                            if (resp2 === "Error") {
                                alert(language.ERROR.AUTH_ERR[currentLanguage]);
                            } else {
                                route.params.setLogin(true);
                            }
                        });
                        cleanUpInputs();
                    }
                });
            }
        });
    }

    const formatDate = (date: string) => {
        if (date.length === 10) {
            return date.substring(8, 10) + "." + date.substring(5, 7) + "." + date.substring(0, 4);
        }
        return date;
    }

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <ScrollView style={[isLargeScreen ? { width: '43%', left: "28%" } : null, { height: 10, backgroundColor: MAINCOLOR }]}>
                <Image source={require('../../assets/splash.png')} style={[styles.logo, { backgroundColor: MAINCOLOR }]} />
                <View style={{ backgroundColor: MAINCOLOR, height: 500 }}>
                    <View style={styles.inputContainer}>
                        <SearchBar style={styles.input} placeholder={language.PROFILE.EMAIL[currentLanguage]} keyboardType='email-address' value={email} onChange={(event: any) => { setEmail(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.USERNAME[currentLanguage]} value={username} onChange={(event: any) => { setUsername(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.LAST_NAME[currentLanguage]} value={surename} onChange={(event: any) => { setSurename(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.FIRST_NAME[currentLanguage]} value={firstname} onChange={(event: any) => { setFirstname(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.INSTITUTION[currentLanguage]} value={institution} onChange={(event: any) => { setInstitution(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.GENDER_PICK[currentLanguage]} value={gender} onChange={(event: any) => { setGender(event.nativeEvent.text.trim()) }} />
                        <View style={{ flexDirection: "row", width: "100%", marginBottom: 5, backgroundColor: "#f5f5f5" }}>
                            <ImagePickerField showPreview={false} onChange={setProfilePic} title={language.PROFILE.PIC_PICK[currentLanguage]} />
                            {profilePic !== '' ? <Image source={{ uri: profilePic }} style={{ width: 35, height: 35, alignSelf: "center" }} /> : null}
                        </View>
                        {Platform.OS === "web" ?
                            createElement('input', { style: { background: "#f5f5f5", borderWidth: 0, color: "#333", fontFamily: "arial", paddingLeft: 9, overflow: "hidden", marginBottom: 5, width: 272, height: 28, fontSize: 16 }, type: 'date', value: birthdate.substring(0, 10), onChange: (event: any) => { setBirthdate(event.target.value); } })
                            :
                            <View style={{ flexDirection: 'row' }}>
                                <SearchBar editable={false} style={[styles.input, { width: 50, flexGrow: 1 }]} placeholder={language.PET.BIRTHDAY[currentLanguage]} value={formatDate(birthdate)} onChange={(event: any) => { setBirthdate(event.nativeEvent.text); }} />
                                <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { setShowDatePicker(true) }}>
                                    <FontAwesomeIcon icon={faCalendar} size={24} color={BLUE} />
                                </TouchableOpacity>
                                {showDatePicker ?
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={new Date(birthdate)}
                                        is24Hour={true}
                                        display="default"
                                        onChange={(event: any, date: Date | undefined) => {
                                            if (event.type === "set" && date) {
                                                setBirthdate(date.toISOString().substring(0, 10));
                                            }
                                            setShowDatePicker(false);
                                        }} />
                                    : null}
                            </View>
                        }
                        <SearchBar style={styles.input} placeholder={language.PROFILE.ZIP[currentLanguage]} value={zip} keyboardType='number-pad' onChange={(event: any) => { setZip(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.CITY[currentLanguage]} value={city} onChange={(event: any) => { setCity(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.PHONE[currentLanguage]} value={number} keyboardType='phone-pad' onChange={(event: any) => { event.nativeEvent.text.replace(/[^0-9]/g, ''); setNumber(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.PASSWORD[currentLanguage]} secureTextEntry={true} value={password} onChange={(event: any) => { setPassword(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.REPEAT_PASSWORD[currentLanguage]} secureTextEntry={true} value={password2} onChange={(event: any) => { setPassword2(event.nativeEvent.text); }} />
                    </View>
                </View>
                <OwnButton
                    title={language.SAVE[currentLanguage]}
                    style={{ width: "auto", padding: 0, minWidth: 0, borderRadius: 0, alignSelf: "center", marginTop: -25, paddingBottom: 20 }}
                    onPress={saveEdit}
                />
            </ScrollView>
        </View>
    );

    function cleanUpInputs() {
        setEmail('');
        setUsername('');
        setSurename('');
        setFirstname('');
        setInstitution('');
        setGender('');
        setProfilePic('');
        setBirthdate('');
        setZip('');
        setCity('');
        setNumber('');
        setPassword('');
        setPassword2('');
    }
}

export function EditPet({ route, props }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    console.log(route.params);
    const currentPet: Pet = route.params.petToEdit;
    const [petName, setPetName] = React.useState(currentPet.NAME);
    const [petType, setPetType] = React.useState(currentPet.ART);
    const [petBreed, setPetBreed] = React.useState(currentPet.RASSE);
    const [petGender, setPetGender] = React.useState(currentPet.GESCHLECHT);
    const [petBirthDate, setPetBirthDate] = React.useState(currentPet.GEBURTSTAG);
    const [petProfilePic, setPetProfilePic] = React.useState(Buffer.from(currentPet.PROFILBILD, "base64").toString("ascii"));
    const [showDatePicker, setShowDatePicker] = React.useState(false);

    const editPet = () => {
        const newPet: Pet = {
            TIERID: currentPet.TIERID,
            USERID: currentPet.USERID,
            NAME: petName,
            ART: petType,
            RASSE: petBreed,
            GESCHLECHT: petGender.charAt(0).toUpperCase() + petGender.slice(1).toLowerCase(),
            GEBURTSTAG: petBirthDate.substring(0, 10),
            PROFILBILD: petProfilePic
        };

        if (newPet.NAME === "" || newPet.ART === "" || newPet.RASSE === "") {
            alert(language.ERROR.NAME_SPECIES_BREED[currentLanguage]);
        } else if (['male', 'female', 'other'].indexOf(petGender.trim().toLowerCase().replace("diverse", "other")) < 0) {
            alert(language.ERROR.INV_GENDER[currentLanguage])
        } else {
            (route.params.api as Api).updatePet(newPet).then((resp) => {
                if (resp.status === 413) {
                    alert(language.ERROR.IMG_TOO_BIG[currentLanguage]);
                } else if (resp.status !== 200) {
                    alert(language.ERROR.CREATE_PET_ERR[currentLanguage]);
                    console.log(resp);
                } else {
                    route.params.navigation.navigate('MyProfile');
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
                        <TextBlock style={styles.title}>{language.EDIT_PET.HEADER[currentLanguage]}</TextBlock>
                        <Seperator />
                        <SearchBar style={styles.input} placeholder={language.PET.NAME[currentLanguage]} value={petName} onChange={(event: any) => { setPetName(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PET.SPECIES[currentLanguage]} value={petType} onChange={(event: any) => { setPetType(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PET.BREED[currentLanguage]} value={petBreed} onChange={(event: any) => { setPetBreed(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PET.GENDER[currentLanguage] + " (Male, Female, Other)"} value={petGender} onChange={(event: any) => { setPetGender(event.nativeEvent.text); }} />
                        {Platform.OS === "web" ?
                            createElement('input', { style: { background: "#f5f5f5", borderWidth: 0, color: "#333", fontFamily: "arial", paddingLeft: 9, overflow: "hidden", marginBottom: 5, width: 272, height: 28, fontSize: 16 }, type: 'date', value: petBirthDate.substring(0, 10), onChange: (event: any) => { setPetBirthDate(event.target.value); } })
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
                        title={language.SAVE[currentLanguage]}
                        style={{ width: "auto", padding: 0, minWidth: 0, borderRadius: 0, alignSelf: "center", marginTop: 5, paddingBottom: 20 }}
                        onPress={editPet}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

export function AddPet(props: any) {  //TODO: Profile pictures uploaded from android doesnt show up on any other device
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
    },
    logo: {
        width: "100%",
        height: 300,
        resizeMode: "contain"
    }
});