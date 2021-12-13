import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BACKGROUNDCOLOR, BLACK, GRAY, MAINCOLOR } from '../Constants/colors';
import { TextBlock } from '../Components/styledText';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';
import { Pet, Preference, Report } from '../Api/interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export default function Discover({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const ownPet: Pet = route.params.ownPet;

    const [discoverList, setDiscoverList] = React.useState<Pet[]>([]);

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        API.getPreferences(ownPet.TIERID).then(res => {
            if (!res.hasOwnProperty('message')) {
                API.getDiscover((res as Preference[]).map(p => p.ID)).then((data: any) => {
                    if (!data.hasOwnProperty('message')) {
                        setDiscoverList((data as Pet[]).filter(p => p.TIERID !== ownPet.TIERID));
                        setIsLoading(false);
                    }
                });
            }
        });
    }, [route, ownPet]);

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[isLargeScreen ? { width: '43%', left: "28%" } : null, { height: "100%", backgroundColor: MAINCOLOR }]}>
                <OwnButton
                    title="Search"
                    style={{ width: "auto", padding: 0, minWidth: 0, borderRadius: 0, alignSelf: "center", marginTop: 5, paddingBottom: 20 }}
                    onPress={() => { }}
                />
                <ScrollView style={{ height: "100%", width: "100%", padding: 10 }}>
                    <View style={[styles.innerContainer, isLoading ? { display: "none" } : null, { backgroundColor: MAINCOLOR, height: "auto" }]}>
                        {isLoading || discoverList.length === 0 ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{"Nichts gefunden :("}</TextBlock> :
                            discoverList.map((discoveredPet: Pet) => {
                                return (
                                    <DiscoverItem
                                        key={"discover-" + discoveredPet.TIERID}
                                        pet={discoveredPet}
                                        navigation={navigation}
                                    />)
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

function DiscoverItem(props: any) {
    const petToDisplay: Pet = props.pet;

    return (
        <View style={petToDisplay == null ? { display: "none" } : null}>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => { props.navigation.navigate('PetProfile', { petID: petToDisplay?.TIERID }); }} >
                    <Image style={styles.petpicture}
                        source={{ uri: petToDisplay?.PROFILBILD != null ? Buffer.from(petToDisplay.PROFILBILD, 'base64').toString('ascii') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                    />
                </TouchableOpacity>
                <View style={{ marginLeft: 10, maxWidth: "80%", height: "100%", justifyContent: "space-around" }}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('MyProfile', { userID: petToDisplay?.USERID }) }}>
                        <TextBlock style={{ color: "#00f" }}>{language.PET.OWNER[currentLanguage]}: {petToDisplay?.USERNAME}</TextBlock>
                    </TouchableOpacity>
                    <TextBlock>{language.PET.NAME[currentLanguage]}: {petToDisplay?.NAME ?? "<Pet Name>"}</TextBlock>
                </View>
                <View style={{ flexDirection: "row", marginLeft: "auto", alignSelf: "center" }}>

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
