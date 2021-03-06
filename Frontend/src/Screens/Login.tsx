import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Image, TouchableOpacity } from 'react-native';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage as cl } from '../Constants/language';
import { API } from '../Constants/api';
import { TextBlock } from '../Components/styledText';


export default function Login({ route, navigation }:any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentLanguage, setCurrentLanguage] = useState(cl);

    React.useEffect(() => {
        setCurrentLanguage(cl);
    }, [cl]);

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <Image source={require('../../assets/splash.png')} style={[styles.logo, {backgroundColor: MAINCOLOR}, isLargeScreen ? { width: '43%', left: "28%" } : null]} />
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : null]}>
                <View style={{ width: "100%", flexDirection: 'row', height: "auto", alignItems: "center", alignSelf: "flex-start", justifyContent: 'center'}}>
                    <View style={{ width: "auto", height: "auto", flexDirection: 'column', alignItems: 'center' }}>
                        <TextBlock>{language.LOGIN.NOT_REG[currentLanguage]}<TouchableOpacity onPress={()=>{navigation.navigate("Register")}}><TextBlock style={{color: "#00f", marginBottom: -3.7}}>{language.LOGIN.HERE[currentLanguage]}</TextBlock></TouchableOpacity>!</TextBlock>
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
                        title={language.LOGIN.LOGIN[currentLanguage]}
                        style={{ width: "auto", padding: 0, minWidth: 0, borderRadius: 0 }}
                        onPress={() => {
                            if (username.trim().length < 3 || password.trim().length < 6 || username.trim().includes(' ') || password.trim().includes(' ')) {
                                alert(language.ERROR.LOGIN_ERR[currentLanguage]);
                            } else {
                                API.getAuthTokenfromServer(username, password).then((resp: void | "Error" ) => {{
                                    if (resp === "Error") {
                                        alert(language.ERROR.LOGIN_ERR[currentLanguage]);
                                    } else {
                                        route.params.setLogin(true);
                                        setUsername('');
                                        setPassword('');
                                    }
                                }});
                            }
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