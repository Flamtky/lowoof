import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView } from 'react-native';
import { BACKGROUNDCOLOR, BLACK, GRAY, MAINCOLOR } from '../Constants/colors';
import { TextBlock } from '../Components/styledText';
import OwnButton from '../Components/ownButton';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';
import { Pet, Relationship } from '../Api/interfaces';
import PetItem from '../Components/petItem';

export default function WatchLater({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const ownPet: Pet = route.params.ownPet;

    const [pets, setPets] = React.useState<Pet[]>([]);
    const [relPets, setRelPets] = React.useState<Relationship[]>([]);
    const [machtedPets, setMatchedFriends] = React.useState<Relationship[]>([]);


    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        API.getWatchlaterList(ownPet.TIERID).then((data: any) => {
            if (!data.hasOwnProperty("message")) {
                setPets(data as Pet[]);
                const tempRelPets: Relationship[] = [];
                (data as Pet[]).forEach((pet: Pet) => {
                    API.getFriendship(ownPet.TIERID, pet.TIERID).then((data2: any) => {
                        if (!data2.hasOwnProperty("message")) {
                            tempRelPets.push(data2 as Relationship);
                        }
                    });

                    // if last iteration
                    if (data.length === tempRelPets.length) {
                        setRelPets(tempRelPets);
                        API.getPetMatches(ownPet.TIERID).then(data3 => {
                            if (!data3.hasOwnProperty("message")) {
                                setMatchedFriends((data3 as Relationship[]).filter(x => (data as Pet[])
                                    .some(t => (t.TIERID === x.TIER_A_ID) && x.RELATIONSHIP !== "B removed A") || (data as Pet[])
                                        .some(t => (t.TIERID === x.TIER_B_ID) && x.RELATIONSHIP !== "A removed B")));
                                setIsLoading(false);
                            }
                        });
                    }
                });
            } else {
                setPets([]);
                console.log(data);
            }
            setIsLoading(false);
        });
    }, [route]);

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[isLargeScreen ? { width: '43%', left: "28%" } : null, { height: "100%", backgroundColor: MAINCOLOR }]}>
                <ScrollView style={{ height: "100%", width: "100%", padding: 10 }}>
                    <View style={[styles.innerContainer, isLoading ? { display: "none" } : null, { backgroundColor: MAINCOLOR, height: "auto" }]}>
                        {isLoading || pets.length === 0 ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>Du hast noch keinen gespeichert</TextBlock> :
                            pets.map((pet: Pet) => {
                                return (
                                    <PetItem
                                        key={"discover-" + pet.TIERID}
                                        pet={pet}
                                        ownPet={ownPet}
                                        isFriend={relPets.some(x => (x.TIER_A_ID === pet.TIERID || x.TIER_B_ID === pet.TIERID) && x.RELATIONSHIP === "Friends")}
                                        hasRequested={relPets.some(x => (x.RELATIONSHIP === "A requested B" && (x.TIER_B_ID === ownPet.TIERID))
                                            || (x.RELATIONSHIP === "B requested A" && (x.TIER_A_ID === ownPet.TIERID)))}
                                        hasOwnRequest={relPets.some(x => (x.RELATIONSHIP === "A requested B" && (x.TIER_A_ID === ownPet.TIERID))
                                            || (x.RELATIONSHIP === "B requested A" && (x.TIER_B_ID === ownPet.TIERID)))}
                                        isMarkedAttractive={machtedPets.some(x => x.TIER_A_ID === (x.TIER_A_ID !== route.params.petID ? x.TIER_A_ID : x.TIER_B_ID)
                                            || x.TIER_B_ID === (x.TIER_A_ID !== route.params.petID ? x.TIER_A_ID : x.TIER_B_ID))}
                                        showRemoveWatchLater={true}
                                        navigation={navigation}
                                        api={API}
                                    />)
                            })
                        }
                    </View>
                </ScrollView>
                <OwnButton title={language.BACK[currentLanguage]} style={{ margin: 32, alignSelf: "flex-start" }} onPress={() => {
                    navigation.goBack();
                }} />
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
