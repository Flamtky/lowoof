import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Image, TouchableOpacity, Platform, createElement } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, BLUE, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import ImagePickerField from '../Components/ImagePicker';
import { User } from '../Api/interfaces';
import { API } from '../Constants/api';
import { TextBlock } from '../Components/styledText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Register({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState<string>('');
    const [userLanguage, setUserLanguage] = useState<string>('');
    const [surename, setSurename] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [institution, setInstitution] = useState<string>('');
    const [gender, setGender] = useState<string>(language.PROFILE.EMAIL[currentLanguage]);
    const [profilePic, setProfilePic] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');
    const [zip, setZip] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');

    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    const register = () => {
        API.isUsernameValid(username).then((res) => {if (!res) {
            alert(language.ERROR.INV_USERNAME[currentLanguage])
        } else if (username.trim().length < 3 || password.trim().length < 6 || username.trim().includes(' ') || password.trim().includes(' ')) {
            alert(language.ERROR.LOGIN_ERR[currentLanguage]);
        } else if (password !== password2) {
            alert(language.ERROR.NO_MATCH[currentLanguage]);
        } else if (email.trim().length < 5 || !email.trim().includes('@') || !email.trim().includes('.')) {
            alert(language.ERROR.INV_EMAIL[currentLanguage]);
        } else if (userLanguage.trim().length !== 2) {
            alert(language.ERROR.INV_LANG[currentLanguage]);
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
                USERID: 0,
                SPRACHID: userLanguage.trim().toUpperCase() === 'DE' ? '2' : '1',
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

            API.createNewUser(user).then((resp: any) => {
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
        }});
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
                        <TextBlock>{language.LOGIN.ALREADY_REG[currentLanguage]}<TouchableOpacity onPress={() => { navigation.navigate("Login") }}><TextBlock style={{ color: "#00f", marginBottom: -3.7 }}>{language.LOGIN.HERE[currentLanguage]}</TextBlock></TouchableOpacity>!</TextBlock>
                        <SearchBar style={styles.input} placeholder={language.PROFILE.EMAIL[currentLanguage]} keyboardType='email-address' value={email} onChange={(event: any) => { setEmail(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.USERNAME[currentLanguage]} value={username} onChange={(event: any) => { setUsername(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.USR_LANGUAGE[currentLanguage]} value={userLanguage} onChange={(event: any) => { setUserLanguage(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.LAST_NAME[currentLanguage]} value={surename} onChange={(event: any) => { setSurename(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.FIRST_NAME[currentLanguage]} value={firstname} onChange={(event: any) => { setFirstname(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.INSTITUTION[currentLanguage]} value={institution} onChange={(event: any) => { setInstitution(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.GENDER_PICK[currentLanguage]} onChange={(event: any) => { setGender(event.nativeEvent.text.trim()) }} />
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
                                        value={new Date()}
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
                        <SearchBar style={styles.input} placeholder={language.PROFILE.ZIP[currentLanguage]} keyboardType='number-pad' onChange={(event: any) => { setZip(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.CITY[currentLanguage]} value={city} onChange={(event: any) => { setCity(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.PHONE[currentLanguage]} keyboardType='phone-pad' onChange={(event: any) => { event.nativeEvent.text.replace(/[^0-9]/g, ''); setNumber(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.PASSWORD[currentLanguage]} secureTextEntry={true} value={password} onChange={(event: any) => { setPassword(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder={language.PROFILE.REPEAT_PASSWORD[currentLanguage]} secureTextEntry={true} value={password2} onChange={(event: any) => { setPassword2(event.nativeEvent.text); }} />
                    </View>
                </View>
                <OwnButton
                    title={language.LOGIN.REGISTER[currentLanguage]}
                    style={{ width: "auto", padding: 0, minWidth: 0, borderRadius: 0, alignSelf: "center", marginTop: -25, paddingBottom: 20 }}
                    onPress={register}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAINCOLOR,
        alignItems: 'center',
        height: "100%"
    },
    input: {
        height: 28,
        width: "100%",
        flexGrow: 1,
        borderRadius: 0,
        alignSelf: 'center',
        marginBottom: 5,
        zIndex: -1
    },
    logo: {
        width: "100%",
        height: 300,
        resizeMode: "contain"
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