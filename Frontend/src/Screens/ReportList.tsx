import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BLACK, GRAY, MAINCOLOR } from '../Constants/colors';
import { TextBlock } from '../Components/styledText';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';
import { Pet, Report } from '../Api/interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash, faUserSlash } from '@fortawesome/free-solid-svg-icons';

export default function ReportList({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    const [reports, setReports] = React.useState<Report[]>([]);

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        API.getAllReports().then((data: any) => {
            if (!data.hasOwnProperty("message")) {
                setReports(data as Report[]);
            } else {
                setReports([]);
                console.log(data);
            }
            setIsLoading(false);
        });
    }, [route]);

    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <View style={[styles.innerContainer, isLoading ? { display: "none" } : null]}>
                    {isLoading || reports.length === 0 ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.TOPTEN.NO_TOPTEN[currentLanguage] /* TODO: ADD LANGUAGE */}</TextBlock> :
                        reports.map((report: Report) => {
                            return (
                                <ReportItem
                                    key={"report-" + report.REPORTID}
                                    report={report}
                                    navigation={navigation}
                                />)
                        })
                    }
                </View>
            </ScrollView>
            <OwnButton title={language.BACK[currentLanguage]} style={{ margin: 32, alignSelf: "flex-start" }} onPress={() => {
                navigation.navigate("MyProfile");
            }} />
        </View>
    );
}

function ReportItem(props: any) {
    const report: Report = props.report;
    const [reportedPet, setReportedPet] = React.useState<Pet | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const banUntil = new Date();
    banUntil.setDate(banUntil.getDate() + 30);

    React.useEffect(() => {
        API.getPetData(report.TIERID).then((res: any) => {
            if (!res.hasOwnProperty("message")) {
                setReportedPet(res as Pet);
            } else {
                alert(res.message);
                console.log(res);
            }
            setIsLoading(false);
        });
    }, [report]);

    return (
        <View style={isLoading || reportedPet == null ? { display: "none" } : null}>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => { props.navigation.navigate('PetProfile', { petID: reportedPet?.TIERID }); }} >
                    <Image style={styles.petpicture}
                        source={{ uri: reportedPet?.PROFILBILD != null ? Buffer.from(reportedPet.PROFILBILD, 'base64').toString('ascii') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                    />
                </TouchableOpacity>
                <View style={{ marginLeft: 10, maxWidth: "80%", height: "100%", justifyContent: "space-around" }}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('MyProfile', { userID: reportedPet?.USERID }) }}>
                        <TextBlock style={{ color: "#00f" }}>{language.PET.OWNER[currentLanguage]}: {reportedPet?.USERNAME}</TextBlock>
                    </TouchableOpacity>
                    <TextBlock>{language.PET.NAME[currentLanguage]}: {reportedPet?.NAME ?? "<Pet Name>"}</TextBlock>
                    <TextBlock>{language.REPORT.REASON[currentLanguage]}: {report.GRUND ?? "<Reasson>"}</TextBlock>
                </View>
                <View style={{ flexDirection: "row", marginLeft: "auto", alignSelf: "center" }}>
                    <TouchableOpacity onPress={() => { API.removeReport(report.REPORTID); setIsLoading(true) }} style={{ marginRight: 6 }}>
                        <FontAwesomeIcon icon={faTrash} size={32} color="#555" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { API.banUser(reportedPet?.USERID ?? 0, banUntil.toISOString().substring(0, 10)); setIsLoading(true) }} style={{ marginRight: 6 }}>
                        <FontAwesomeIcon icon={faUserSlash} size={32} color="#f00" />
                    </TouchableOpacity>
                </View>
            </View>
            <Seperator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAINCOLOR,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    innerContainer: {
        margin: 32,
        marginTop: 5,
        flex: 1,
    },
    profilepicture: {
        width: 64,
        height: 64,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#000",
        backgroundColor: BLACK
    },
    petpicture: {
        width: 64,
        height: 64,
        borderWidth: 1.5,
        borderRadius: 10,
        borderColor: GRAY,
        backgroundColor: BLACK
    },
    row: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "flex-start",
    },
});
