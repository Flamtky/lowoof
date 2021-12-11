import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Pet } from '../Api/interfaces';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';

export default function Report({ navigation, route }: any) {
    const dimensions = useWindowDimensions();
    const props = route.params;
    const isLargeScreen = dimensions.width >= 768;
    const petToReport: Pet = props.petToReport;
    const [reason, setReason] = React.useState('');
    React.useEffect(() => {
        navigation.setParams({ name: petToReport.USERNAME + " reporten" })  //TODO: language?
        if (petToReport == undefined) {
            props.navigation.navigate('MyProfile');
        }
    }, [petToReport]);
    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : { width: "100%" }]}>
                <View style={styles.innerContainer}>
                    <Text style={{ alignSelf: 'center', fontSize: 16 }}>{language.REPORT.REALLY_REPORT[currentLanguage]}<Text style={styles.name}>'{petToReport.USERNAME}'</Text>{language.REPORT.REALLY_REPORT2[currentLanguage]}</Text>
                    <SearchBar
                        placeholder={language.REPORT.REASON[currentLanguage]}
                        style={styles.input}
                        value={reason}
                        onChange={(event: any) => {
                            setReason(event.nativeEvent.text);
                        }}
                    />
                    <OwnButton title={language.REPORT.HEADER[currentLanguage]} onPress={() => {
                        if (reason.trim() === '') {
                            alert(language.ERROR.NEED_REASON[currentLanguage]);
                        } else if (reason.trim().length > 255) {
                            alert(language.ERROR.REASON_TOO_LONG[currentLanguage]);
                        } else {
                            API.addReport(petToReport.USERID, reason.trim()).then((resp) => {
                                if (resp.message === "/* TODO: ADD */") {  //TODO: 
                                    alert(language.REPORT.SUCCESS_REPORTED[currentLanguage]);
                                    window.location.reload();
                                } else {
                                    console.log(resp);
                                }
                                setReason('');
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