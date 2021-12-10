import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Pet } from '../Api/interfaces';
import { Api } from '../Api/lowoof-api';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';

export default function Report({ navigation, route }: any) {
    const dimensions = useWindowDimensions();
    const props = route.params;
    const isLargeScreen = dimensions.width >= 768;
    const api: Api = props.api;
    const petToReport: Pet = props.petToReport;
    const [reasson, setReasson] = React.useState('');
    React.useEffect(() => {
        navigation.setParams({ name: petToReport.USERNAME + " reporten" })
        if (petToReport == undefined) {
            props.navigation.navigate('MyProfile');
        }
    }, [petToReport]);
    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : { width: "100%" }]}>
                <View style={styles.innerContainer}>
                    <Text style={{ alignSelf: 'center', fontSize: 16 }}>Möchtest du wirklich <Text style={styles.name}>'{petToReport.USERNAME}'</Text> melden?</Text>
                    <SearchBar
                        placeholder="Reasson"
                        style={styles.input}
                        value={reasson}
                        onChange={(event: any) => {
                            setReasson(event.nativeEvent.text);
                        }}
                    />
                    <OwnButton title="Melden" onPress={() => {
                        if (reasson.trim() === '') {
                            alert("Bitte geben Sie einen Grund an!");
                        } else {
                            api.addReport(petToReport.USERID, reasson.trim()).then((resp) => {
                                if (resp.message === "/* TODO: ADD */") {
                                    alert("Reported!");
                                    window.location.reload();
                                } else {
                                    console.log(resp);
                                }
                                setReasson('');
                            });
                        }
                    }} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAINCOLOR,
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%"
    },
    name: {
        fontWeight: 'bold'
    },
    input: {
        height: 42,
        width: "100%",
        flexGrow: 1,
        borderRadius: 0,
    },
    innerContainer: {
        alignSelf: 'center',
        paddingHorizontal: 20,
        width: "100%",
    }
});