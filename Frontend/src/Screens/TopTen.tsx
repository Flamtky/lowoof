import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BLACK, GRAY, MAINCOLOR } from '../Constants/colors';
import { TextBlock } from '../Components/styledText';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';
import { Pet, Relationship } from '../Api/interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function TopTen({ route, navigation }:any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    const [topten, setTopten] = React.useState<Pet[] | null>(null);

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
            API.getTopPets(10).then((data: any) => {
                if (!data.hasOwnProperty("message")) {
                    setTopten(data as Pet[]);
                } else {
                    alert(data.message);
                    console.log(data);
                }
            });
    }, [route]);

    return (
        <View style={{ width: "100%", height: "100%", backgroundColor: MAINCOLOR }}>
            <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%', marginLeft: "20%" } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.TOPTEN.HEADER[currentLanguage]}:</TextBlock>
                <Seperator />
                
                {topten === null || topten.length === 0 || isLoading ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.TOPTEN.NO_TOPTEN[currentLanguage]}</TextBlock> :
                    topten.map((topPet: Pet) => {
                        return (
                            <PetItem
                                key={"topten-" + topPet.TIERID}
                                pet={topPet}
                            />)
                    })
                }




            </ScrollView>
            <OwnButton title={language.BACK[currentLanguage]} style={{ margin: 32, alignSelf: "flex-start" }} onPress={() => {
                navigation.navigate("MyProfile");
            }} />
            </View>
        </View>
    );
}

function PetItem(props: any) {
    const pet: Pet = props.pet;
    return (
        <View>
            <Seperator />
            <View style={styles.row}>
                <TouchableOpacity onPress={props.onPic} >
                    <Image style={styles.petpicture}
                        source={{ uri: pet?.PROFILBILD != null ? Buffer.from(pet.PROFILBILD, 'base64').toString('ascii') : "https://puu.sh/IsTPQ/5d69029437.png" }}
                    />
                </TouchableOpacity>
                <View style={{ marginLeft: 10 }}>
                    <TextBlock>{language.PET.NAME[currentLanguage]}: {pet.NAME ?? "<Name>"}</TextBlock>
                    <TextBlock>{language.PET.SPECIES[currentLanguage]}: {pet.ART ?? "<Species>"}</TextBlock>
                    <TextBlock>{language.PET.BREED[currentLanguage]}: {pet.RASSE ?? "<Breed>"}</TextBlock>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('Report', { petToReport: pet }); }} style={{ marginRight: 6 }}>
                        <FontAwesomeIcon icon={faExclamationTriangle} size={32} color="#f66" />
                    </TouchableOpacity>
                </View>
            </View>
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
