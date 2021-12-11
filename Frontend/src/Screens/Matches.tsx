import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { BLACK, MAINCOLOR } from '../Constants/colors';
import { TextBlock } from '../Components/styledText';
import Seperator from '../Components/seperator';
import OwnButton from '../Components/ownButton';
import PetItem from '../Components/petItem';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';
import { Pet, Relationship } from '../Api/interfaces';


export default function Matches({ route, navigation }:any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    const [matches, setmatches] = React.useState<Relationship[] | null>(null);
    const [matchesPets, setMatchesPets] = React.useState<Pet[] | null>(null);
    const [matchedFriends, setMatchedFriends] = React.useState<Relationship[] | null>(null);

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (route.params.petID == undefined) {
            navigation.navigate('MyProfile');
        } else {
            API.getPetMatches(route.params.petID).then(data => { //TODO: change to get matches. Needs API update
                if (!data.hasOwnProperty("message")) {
                    setmatches(data as Relationship[]);
                    
                    let temp: Pet[] = [];
                    (data as Relationship[]).forEach(async rel => {
                        await API.getPetData(rel.TIER_A_ID !== route.params.petID ? rel.TIER_A_ID : rel.TIER_B_ID).then((data2) => {
                            if (!data2.hasOwnProperty("message")) {
                                temp.push((data2 as Pet));
                            }
                        });
                        // if last iteration
                        if (temp.length === (data as Relationship[]).length) {
                            setMatchesPets(temp);
                            API.getPetRelationships(route.params.petID).then(data3 => {
                                if (!data.hasOwnProperty("message")) {
                                    setMatchedFriends((data3 as Relationship[]).filter(x => temp.some(t => t.TIERID === x.TIER_A_ID) || temp.some(t => t.TIERID === x.TIER_B_ID)));
                                    setIsLoading(false);
                                }
                            });
                        }
                    });
                }
            });
        }
    }, [route]);

    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.MATCHES.HEADER[currentLanguage]}:</TextBlock>
                <Seperator />
                
                {matches === null || matchesPets === null || matchedFriends === null || matches.length === 0 || isLoading ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.MATCHES.NO_MATCHES[currentLanguage]}</TextBlock> :
                    matches.map((match: Relationship) => {
                        return (
                            <PetItem
                                key={match.RELATIONID}
                                myPetID={route.params.petID}
                                pet={matchesPets.find(x => x.TIERID === (match.TIER_A_ID !== route.params.petID ? match.TIER_A_ID : match.TIER_B_ID)) as Pet}
                                isFriend={matchedFriends.filter(x => x.RELATIONSHIP === "Friends").some(x => x.TIER_A_ID === (match.TIER_A_ID !== route.params.petID ? match.TIER_A_ID : match.TIER_B_ID) || x.TIER_B_ID === (match.TIER_A_ID !== route.params.petID ? match.TIER_A_ID : match.TIER_B_ID))}
                                hasRequested={matchedFriends.filter(x => x.TIER_B_ID === route.params.petID && x.RELATIONSHIP !== "Friends").some(x => x.TIER_A_ID === (match.TIER_A_ID !== route.params.petID ? match.TIER_A_ID : match.TIER_B_ID) || x.TIER_B_ID === (match.TIER_A_ID !== route.params.petID ? match.TIER_A_ID : match.TIER_B_ID))}
                                hasOwnRequest={matchedFriends.filter(x => x.TIER_A_ID === route.params.petID && x.RELATIONSHIP !== "Friends").some(x => x.TIER_A_ID === (match.TIER_A_ID !== route.params.petID ? match.TIER_A_ID : match.TIER_B_ID) || x.TIER_B_ID === (match.TIER_A_ID !== route.params.petID ? match.TIER_A_ID : match.TIER_B_ID))}
                                isMarkedAttractive={true}
                                navigation={navigation}
                                api={API}
                            />)
                    })
                }




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
    row: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "flex-start",
    },
});
