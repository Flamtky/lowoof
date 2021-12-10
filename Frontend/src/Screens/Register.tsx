import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Image, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, BLACK, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePickerField from '../Components/ImagePicker';
import { User } from '../Api/interfaces';
import { API } from '../Constants/api';

type Gender = "Male" | "Female" | "Other";

export default function Register({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState<string>('');
    const [surename, setSurename] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [institution, setInstitution] = useState<string>('');
    const [gender, setGender] = useState<Gender>("Male");
    const [profilePic, setProfilePic] = useState<string>('');
    const [birthdate, setBirthdate] = useState<string>('');
    const [zip, setZip] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');

    const register = () => {
        if (username.trim().length < 3 || password.trim().length < 6 || username.trim().includes(' ') || password.trim().includes(' ')) {
            alert('Invalid username or password.');
        } else if (password !== password2) {
            alert('Passwords do not match.');
        } else if (email.trim().length < 5 || !email.trim().includes('@') || !email.trim().includes('.')) {
            alert('Invalid email.');
        } else if (['Male', 'Female', 'Other'].indexOf(gender.trim()) >= 0) {
            alert('Invalid gender.')
        } else if (birthdate.trim().length !== 10) {
            alert('Invalid birthdate.');
        } else if (zip.trim().length !== 5 || isNaN(Number(zip))) {
            alert('Invalid zip.');
        } else if (number.trim().length !== 10 || isNaN(Number(number))) {
            alert('Invalid number.');
        } else {
            // new user
            const user: User = {
                USERID: 0,
                SPRACHID: currentLanguage,
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
                MITGLIEDSCHAFTPAUSIERT: 0
            };

            API.createNewUser(user).then((resp: any) => {
                if (resp.status !== 201) {
                    alert('Error on creating user.');
                    console.log(resp);
                } else {
                    API.getAuthTokenfromServer(username, password).then((resp2: void | "Error") => {
                        if (resp2 === "Error") {
                            alert('Error on authentication');
                        } else {
                            route.params.setLogin(true);
                        }
                    });
                    cleanUpInputs();
                }
            });
        }
    }

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <ScrollView style={[isLargeScreen ? { width: '43%', left: "28%" } : null, { height: "100%", backgroundColor: MAINCOLOR }]}>
                <Image source={require('../../assets/splash.png')} style={[styles.logo, { backgroundColor: MAINCOLOR }]} />
                <View style={{ backgroundColor: MAINCOLOR, height: "100%" }}>
                    <View style={styles.inputContainer}>
                        <SearchBar style={styles.input} placeholder="E-Mail" keyboardType='email-address' value={email} onChange={(event: any) => { setEmail(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Username" value={username} onChange={(event: any) => { setUsername(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Surename" value={surename} onChange={(event: any) => { setSurename(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Firstname" value={firstname} onChange={(event: any) => { setFirstname(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Institution" value={institution} onChange={(event: any) => { setInstitution(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Gender | Male, Female, Other" onChange={(event: any) => {setGender(event.nativeEvent.text.trim())}}/>
                        <View style={{ flexDirection: "row", width: "100%", marginBottom: 5, backgroundColor: "#f5f5f5" }}>
                            <ImagePickerField showPreview={false} onChange={setProfilePic} title="Pick Profile Picture" />
                            {profilePic !== '' ? <Image source={{ uri: profilePic }} style={{ width: 35, height: 35, alignSelf:"center" }} /> : null}
                        </View>
                        <SearchBar style={styles.input} placeholder="Birthdate" maxLength={2 + 1 + 2 + 1 + 4} value={birthdate} onChange={(event: any) => { setBirthdate(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Zip" keyboardType='number-pad' onChange={(event: any) => { setZip(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="City" value={city} onChange={(event: any) => { setCity(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Number" keyboardType='phone-pad' onChange={(event: any) => { event.nativeEvent.text.replace(/[^0-9]/g, ''); setNumber(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Password" secureTextEntry={true} value={password} onChange={(event: any) => { setPassword(event.nativeEvent.text); }} />
                        <SearchBar style={styles.input} placeholder="Repeat password" secureTextEntry={true} value={password2} onChange={(event: any) => { setPassword2(event.nativeEvent.text); }} />
                    </View>
                </View>
                <OwnButton
                    title="➤ Register"
                    style={{ width: 120, padding: 0, minWidth: 0, borderRadius: 0, alignSelf: "center", marginTop: 5, paddingBottom: 20 }}
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
        setGender("Male");
        setProfilePic('');
        setBirthdate('');
        setZip('');
        setCity('');
        setNumber('');
        setPassword('');
        setPassword2('');
    }
}

export function DropDown(props: any) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Male', value: 'm' },
        { label: 'Woman', value: 'w' },
        { label: 'Other', value: 'o' }
    ]);
    React.useEffect(() => {
        props.onChange(value);
    }, [value]);

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            style={styles.dropdown}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Gender"
            dropDownDirection='AUTO'
            showArrowIcon={false}
            containerStyle={{
                width: "auto",
                marginRight: "auto",
                alignSelf: "center",
                justifyContent: "center",
                paddingStart: 10,
            }}
            textStyle={{
                fontSize: 16,
                color: "#333",
            }}
            dropDownContainerStyle={{
                width: 64,
                borderWidth: 0.5,
                borderColor: BACKGROUNDCOLOR,
                borderRadius: 0,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                zIndex: 50000
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAINCOLOR,
        alignItems: 'center',
        height: "100%"
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
    logo: {
        width: "100%",
        height: "50%",
        resizeMode: "contain"
    },
    dropdown: {
        width: "auto",
        height: 24,
        flexGrow: 1,
        borderRadius: 0,
        alignSelf: 'center',
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