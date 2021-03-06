import React from 'react';
import { StyleSheet, View, useWindowDimensions, ScrollView } from 'react-native';
import OwnButton from '../Components/ownButton';
import Seperator from '../Components/seperator';
import { TextBlock } from '../Components/styledText';
import { BLACK, MAINCOLOR } from '../Constants/colors';
import { Pet, Relationship } from '../Api/interfaces';
import PetItem from '../Components/petItem';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';


export default function Friends({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;

    const [friends, setFriends] = React.useState<Relationship[] | null>(null);
    const [friendsIn, setFriendsIn] = React.useState<Relationship[] | null>(null);
    const [friendsOut, setFriendsOut] = React.useState<Relationship[] | null>(null);
    const [friendsPets, setFriendsPets] = React.useState<Pet[] | null>(null);
    const [matchedFriends, setMatchedFriends] = React.useState<Relationship[] | null>(null);

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (route.params.petID == undefined) {
            navigation.navigate('MyProfile');
        } else {
            API.getPetRelationships(route.params.petID).then((data: any) => {
                if (!data.hasOwnProperty("message")) {

                    setFriends((data as Relationship[]).filter(x => x.RELATIONSHIP === "Friends"));
                    setFriendsIn((data as Relationship[]).filter(x => (x.RELATIONSHIP === "A requested B" && x.TIER_B_ID === route.params.petID) 
                    || (x.RELATIONSHIP === "B requested A" && x.TIER_A_ID === route.params.petID)));
                    setFriendsOut((data as Relationship[]).filter(x => (x.RELATIONSHIP === "A requested B" && x.TIER_A_ID === route.params.petID) 
                    || (x.RELATIONSHIP === "B requested A" && x.TIER_B_ID === route.params.petID)));

                    if ((data as Relationship[]).length === 0) {
                        setMatchedFriends([]);
                        setFriendsPets([]);
                        setIsLoading(false);
                    }

                    let tempFriendsPets: Pet[] = [];
                    (data as Relationship[]).forEach(async rel => {
                        await API.getPetData(rel.TIER_A_ID !== route.params.petID ? rel.TIER_A_ID : rel.TIER_B_ID).then((data2) => {
                            if (!data2.hasOwnProperty("message")) {
                                tempFriendsPets.push((data2 as Pet));
                            }
                        });

                        // if last iteration
                        if (tempFriendsPets.length === (data as Relationship[]).length) {
                            setFriendsPets(tempFriendsPets);
                            API.getPetMatches(route.params.petID).then(data3 => {
                                if (!data3.hasOwnProperty("message")) {
                                    setMatchedFriends((data3 as Relationship[]).filter(x => tempFriendsPets
                                        .some(t => (t.TIERID === x.TIER_A_ID) && x.RELATIONSHIP !== "B removed A") || tempFriendsPets
                                        .some(t => (t.TIERID === x.TIER_B_ID) && x.RELATIONSHIP !== "A removed B")));
                                    setIsLoading(false);
                                }
                            });
                        }
                    });
                } else if ((data as Response).status === 403) {
                    alert(data.message);
                    navigation.goBack();
                }
            });
        }
    }, [route]);

    return (
        <View style={{ width: "100%", height: "100%", backgroundColor: MAINCOLOR }}>
            <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%', marginLeft: "20%" } : { width: "100%" }]}>
                <ScrollView style={{ width: '100%' }}
                    keyboardDismissMode="on-drag"
                >
                    <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.FRIENDS.INCOMING_FRIEND[currentLanguage]}:</TextBlock>
                    <Seperator />

                    {friendsIn === null || friendsPets === null || matchedFriends === null || friendsIn.length === 0 || isLoading ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.FRIENDS.NO_REQUESTS[currentLanguage]}</TextBlock> :
                        friendsIn.map((friend: Relationship) => {
                            return (
                                <PetItem
                                    key={friend.RELATIONID}
                                    petID={route.params.petID}
                                    pet={friendsPets.find(x => x.TIERID === (friend.TIER_A_ID !== route.params.petID ? friend.TIER_A_ID : friend.TIER_B_ID)) as Pet}
                                    isFriend={false}
                                    hasRequested={true}
                                    hasOwnRequest={false}
                                    isMarkedAttractive={matchedFriends.some(x => x.TIER_A_ID === (friend.TIER_A_ID !== route.params.petID ? friend.TIER_A_ID : friend.TIER_B_ID) || x.TIER_B_ID === (friend.TIER_A_ID !== route.params.petID ? friend.TIER_A_ID : friend.TIER_B_ID))}
                                    navigation={navigation}
                                    api={API}
                                />)
                        })
                    }

                    <Seperator style={{ marginBottom: 50 }} />
                    <TextBlock style={{ marginLeft: 15 }}>{language.FRIENDS.HEADER[currentLanguage]}:</TextBlock>
                    <Seperator />

                    {friends === null || friendsPets === null || matchedFriends === null || friends.length === 0 || isLoading ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.FRIENDS.NO_FRIENDS[currentLanguage]} ????</TextBlock> :
                        friends.map((friend: Relationship) => {
                            return (
                                <PetItem
                                    key={friend.RELATIONID}
                                    petID={route.params.petID}
                                    pet={friendsPets.find(x => x.TIERID === (friend.TIER_A_ID !== route.params.petID ? friend.TIER_A_ID : friend.TIER_B_ID)) as Pet}
                                    isFriend={true}
                                    hasRequested={false}
                                    hasOwnRequest={false}
                                    isMarkedAttractive={matchedFriends.some(x => x.TIER_A_ID === (friend.TIER_A_ID !== route.params.petID ? friend.TIER_A_ID : friend.TIER_B_ID) || x.TIER_B_ID === (friend.TIER_A_ID !== route.params.petID ? friend.TIER_A_ID : friend.TIER_B_ID))}
                                    navigation={navigation}
                                    api={API}
                                />)
                        })
                    }

                    <Seperator style={{ marginBottom: 50 }} />
                    <TextBlock style={{ marginLeft: 15 }}>{language.FRIENDS.OUTGOING_FRIEND[currentLanguage]}:</TextBlock>
                    <Seperator />

                    {friendsOut === null || friendsPets === null || matchedFriends === null || friendsOut.length === 0 || isLoading ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.FRIENDS.NO_REQUESTS[currentLanguage]}</TextBlock> :
                        friendsOut.map((friend: Relationship) => {
                            return (
                                <PetItem
                                    key={friend.RELATIONID}
                                    petID={route.params.petID}
                                    pet={friendsPets.find(x => x.TIERID === (friend.TIER_A_ID !== route.params.petID ? friend.TIER_A_ID : friend.TIER_B_ID)) as Pet}
                                    isFriend={false}
                                    hasRequested={false}
                                    hasOwnRequest={true}
                                    isMarkedAttractive={matchedFriends.some(x => x.TIER_A_ID === (friend.TIER_A_ID !== route.params.petID ? friend.TIER_A_ID : friend.TIER_B_ID) || x.TIER_B_ID === (friend.TIER_A_ID !== route.params.petID ? friend.TIER_A_ID : friend.TIER_B_ID))}
                                    navigation={navigation}
                                    api={API}
                                />)
                        })
                    }
                    <Seperator />
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
    profilepicture: {
        width: 64,
        height: 64,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#000",
        backgroundColor: BLACK,
    },
    row: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "flex-start",
    },
});