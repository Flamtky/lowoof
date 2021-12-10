import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { API, currentLanguage } from '../../App';

export default function Login({ route, navigation }:any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <Image source={require('../../assets/splash.png')} style={[styles.logo, {backgroundColor: MAINCOLOR}, isLargeScreen ? { width: '43%', left: "28%" } : null]} />
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : null]}>
                <View style={{ width: "100%", flexDirection: 'row', height: "auto", alignItems: "center", alignSelf: "flex-start", justifyContent: 'center'}}>
                    <View style={{ width: "auto", height: "auto", flexDirection: 'column', alignItems: 'center' }}>
                        <SearchBar
                            placeholder={language.PLACEHOLDER.USERNAME[currentLanguage]}
                            style={styles.input}
                            value={username}
                            onChange={(event: any) => {
                                setUsername(event.nativeEvent.text);
                            }}
                        />
                        <SearchBar
                            placeholder={language.PLACEHOLDER.PASSWORD[currentLanguage]}
                            style={styles.input}
                            value={password}
                            onChange={(event: any) => {
                                setPassword(event.nativeEvent.text);
                            }}
                            secureTextEntry={true}
                        />
                    </View>
                    
                </View>
                <OwnButton
                        title={language.LOGIN[currentLanguage]}
                        style={{ width: 88, padding: 0, minWidth: 0, borderRadius: 0 }}
                        onPress={() => {
                            if (username.trim().length < 3 || password.trim().length < 6 || username.trim().includes(' ') || password.trim().includes(' ')) {
                                alert(language.LOGIN_ERR[currentLanguage]);
                            } else {
                                API.getAuthTokenfromServer(username, password).then((resp: void | "Error" ) => {{
                                    if (resp === "Error") {
                                        alert(language.LOGIN_ERR[currentLanguage]);
                                    } else {
                                        route.params.setLogin(true);
                                    }
                                }});
                            }
                            setUsername('');
                            setPassword('');
                        }}
                    />
            </View>
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
    input: {
        height: 42,
        width: 300,
        flexGrow: 1,
        borderRadius: 0,
        alignSelf: 'center',
        marginBottom: 5,
    },
    logo: {
        width: "100%",
        height: "50%",
        resizeMode: "contain"
    }
});