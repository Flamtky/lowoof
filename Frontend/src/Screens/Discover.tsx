import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BACKGROUNDCOLOR, BLACK, GRAY, MAINCOLOR } from '../Constants/colors';
import { TextBlock } from '../Components/styledText';
import OwnButton from '../Components/ownButton';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';
import PetItem from '../Components/petItem';
import { Pet, Preference, Relationship } from '../Api/interfaces';

export default function Discover({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const ownPet: Pet = route.params.ownPet;

    const [discoverList, setDiscoverList] = React.useState<Pet[]>([]);
    const [relPets, setRelPets] = React.useState<Relationship[]>([]);
    const [machtedPets, setMatchedFriends] = React.useState<Relationship[]>([]);

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        API.getPreferences(ownPet.TIERID).then(res => {
            if (!res.hasOwnProperty('message')) {
                API.getDiscover((res as Preference[]).map(p => p.ID)).then((data: any) => {
                    if (!data.hasOwnProperty('message')) {
                        setDiscoverList((data as Pet[]).filter(p => p.TIERID !== ownPet.TIERID));
                    }
                    setIsLoading(false);
                    
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
                            API.getPetMatches(route.params.petID).then(data3 => {
                                if (!data3.hasOwnProperty("message")) {
                                    setMatchedFriends((data3 as Relationship[]).filter(x => (data as Pet[])
                                        .some(t => (t.TIERID === x.TIER_A_ID) && x.RELATIONSHIP !== "B removed A") || (data as Pet[])
                                        .some(t => (t.TIERID === x.TIER_B_ID) && x.RELATIONSHIP !== "A removed B")));
                                    setIsLoading(false);
                                }
                            });
                        }
                    });
                });
            }
        });
    }, [route, ownPet]);

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[isLargeScreen ? { width: '43%', left: "28%" } : null, { height: "100%", backgroundColor: MAINCOLOR }]}>
                <View style={{ flexDirection:"row" }}>
                    <OwnButton
                        title="Search"
                        style={{ width: "auto", padding: 0, minWidth: 0, borderRadius: 0, alignSelf: "center", marginTop: 5, paddingBottom: 20 }}
                        onPress={() => { }}
                    />
                    <OwnButton
                        title="Watch Later List"
                        style={{ width: "auto", padding: 0, minWidth: 0, borderRadius: 0, alignSelf: "center", marginTop: 5, paddingBottom: 20 }}
                        onPress={() => {navigation.navigate("WatchLater" , { ownPet: ownPet })}}
                    />
                </View>
                <ScrollView style={{ height: "100%", width: "100%", padding: 10 }}>
                    <View style={[styles.innerContainer, isLoading ? { display: "none" } : null, { backgroundColor: MAINCOLOR, height: "auto" }]}>
                    {isLoading || discoverList.length === 0 ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>Nichts gefunden :(</TextBlock> :
                        discoverList.map((pet: Pet) => {
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
                                    showWatchLater={true}
                                    navigation={navigation}
                                    api={API}
                                />)
                        })
                    }
                    </View>
                </ScrollView>
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
