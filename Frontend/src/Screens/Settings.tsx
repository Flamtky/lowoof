import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView } from 'react-native';
import OwnButton from '../Components/ownButton';
import { BLACK, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';
import SearchBar from '../Components/searchbar';

export default function Settings({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [showPause, setShowPause] = React.useState(false);
    const [showDelete, setShowDelete] = React.useState(false);
    const [deleteReason, setDeleteReason] = React.useState('');

    React.useEffect(() => {
        setShowPause(false);
        setShowDelete(false);
    }, [route]);
    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <View style={[styles.innerContainer]}>
                    <OwnButton title={language.SETTINGS.LOGOUT[currentLanguage]} style={styles.button} onPress={() => {
                        API.setOnlineStatus(API.getCurrentUser()?.USERID ?? 0, false);
                        route.params.setLogin(false);
                        navigation.navigate("Login");
                    }} />
                    <OwnButton title={language.SETTINGS.PAUSE[currentLanguage]} style={[styles.button, { marginBottom: 2 }]} innerStyle={{ color: BLACK, backgroundColor: "#ff0" }} onPress={() => {
                        setShowPause(true);
                    }} />
                    {showPause ?
                        <OwnButton title={language.SETTINGS.SURE[currentLanguage]} style={[styles.button, { marginTop: 0 }]} innerStyle={{ color: BLACK, backgroundColor: "#ff0" }} onPress={() => {
                            API.banUser(API.getCurrentUser()?.USERID ?? 0).then((resp) => {
                                API.setOnlineStatus(API.getCurrentUser()?.USERID ?? 0, false);
                                setShowPause(false);
                                if (resp.status === 200) {
                                    alert(language.SETTINGS.SUCCESS_PAUSE[currentLanguage]);
                                    route.params.setLogin(false);
                                    navigation.navigate("Login");
                                } else {
                                    alert(resp.message);
                                    console.log(resp);
                                }
                            });
                        }} />
                        : null}
                    <OwnButton title={language.SETTINGS.QUIT[currentLanguage]} style={[styles.button, { marginBottom: 2 }]} innerStyle={{ backgroundColor: "#f00" }} onPress={() => {
                        setShowDelete(true);
                    }} />
                    {showDelete ?
                        <View style={{ flexDirection: "row" }}>
                            <OwnButton title={language.SETTINGS.SURE[currentLanguage]} style={[styles.button, { marginTop: 0, marginRight: 0 }]} innerStyle={{ backgroundColor: "#f00" }} onPress={() => {
                                if (deleteReason.trim().length > 0) {
                                    API.deleteUser(API.getCurrentUser()?.USERID ?? 0, deleteReason).then((resp) => {
                                        API.setOnlineStatus(API.getCurrentUser()?.USERID ?? 0, false);
                                        setShowDelete(false);
                                        if (resp.status === 200) {
                                            alert(language.SETTINGS.SUCCESS_QUIT[currentLanguage]);
                                            route.params.setLogin(false);
                                            navigation.navigate("Login");
                                        } else {
                                            alert(resp.message);
                                            console.log(resp);
                                        }
                                    });
                                } else {
                                    alert(language.SETTINGS.GIVE_REASON[currentLanguage]);
                                }
                            }} />
                            <SearchBar style={styles.input} placeholder={language.SETTINGS.REASON[currentLanguage]} value={deleteReason} onChange={(event: any) => { setDeleteReason(event.nativeEvent.text); }} />
                        </View>
                        : null}
                </View>
            </ScrollView>
            <OwnButton title={language.BACK[currentLanguage]} style={{ margin: 32, alignSelf: "flex-start" }} onPress={() => {
                navigation.goBack();
            }} />
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
    button: {
        margin: 32,
        alignSelf: "flex-start",
    },
    input: {
        height: 40,
        alignSelf: "flex-start",
    },
});