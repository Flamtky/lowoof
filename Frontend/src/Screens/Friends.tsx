import React from 'react';
import { StyleSheet, View, Image, Text, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import OwnButton from '../Components/ownButton';
import Seperator from '../Components/seperator';
import { TextBlock } from '../Components/styledText';
import { BLACK, MAINCOLOR } from '../Constants/colors';
import { Api } from '../Api/lowoof-api';
import { Pet, Relationship, User } from '../Api/interfaces';
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

    const [isLoading, setIsLoading] = React.useState(true);

    const api:Api = API;

    React.useEffect(() => {
        if (route.params.petID == undefined) {
            navigation.navigate('MyProfile');
        } else {
            api.getPetRelationships(route.params.petID).then(data => {
                if (!data.hasOwnProperty("message")) {
                    setFriends((data as Relationship[]).filter(x => x.RELATIONSHIP === "Friends"));
                    setFriendsIn((data as Relationship[]).filter(x => x.TIER_B_ID === route.params.petID && x.RELATIONSHIP !== "Friends"));
                    setFriendsOut((data as Relationship[]).filter(x => x.TIER_A_ID === route.params.petID && x.RELATIONSHIP !== "Friends"));

                    let temp: Pet[] = [];
                    (data as Relationship[]).forEach(async rel => {
                        await api.getPetData(rel.TIER_A_ID !== route.params.petID ? rel.TIER_A_ID : rel.TIER_B_ID).then((data2) => {
                            if (!data2.hasOwnProperty("message")) {
                                temp.push((data2 as Pet));
                            }
                        });
                        // if last iteration
                        if (temp.length === (data as Relationship[]).length) {
                            setIsLoading(false);
                            setFriendsPets(temp);
                        }
                    });
                }

            });
        }
    }, [route]);

    return (
        <View style={[styles.item, styles.container, isLargeScreen ? { width: '60%' } : { width: "100%" }, isLoading ? { display: "none" } : null]}>
            <ScrollView style={{ width: '100%' }}
                keyboardDismissMode="on-drag"
            >
                <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.FRIENDS.INCOMING_FRIEND[currentLanguage]}:</TextBlock>
                <Seperator />

                {friendsIn === null || friendsPets === null || friendsIn.length === 0 || isLoading ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.FRIENDS.NO_REQUESTS[currentLanguage]} {friendsPets?.toString()}</TextBlock> :
                    friendsIn.map((friend: Relationship) => {
                        return (
                            <PetItem
                                key={friend.RELATIONID}
                                myPetID={route.params.petID}
                                pet={friendsPets.find(x => x.TIERID === friend.TIER_A_ID) as Pet}
                                isFriend={false}
                                hasRequested={true}
                                hasOwnRequest={false}
                                isMarkedAttractive={false /*TODO: add*/}
                                navigation={navigation}
                                api={api}
                            />)
                    })
                }

                <Seperator style={{ marginBottom: 50 }} />
                <TextBlock style={{ marginLeft: 15 }}>{language.FRIENDS.HEADER[currentLanguage]}:</TextBlock>
                <Seperator />

                {friends === null || friendsPets === null || friends.length === 0 || isLoading ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.FRIENDS.NO_FRIENDS[currentLanguage]} {friendsPets?.toString()}</TextBlock> :
                    friends.map((friend: Relationship) => {
                        return (
                            <PetItem
                                key={friend.RELATIONID}
                                myPetID={route.params.petID}
                                pet={friendsPets.find(x => x.TIERID === (friend.TIER_A_ID !== route.params.petID ? friend.TIER_A_ID : friend.TIER_B_ID)) as Pet}
                                isFriend={true}
                                hasRequested={false}
                                hasOwnRequest={false}
                                isMarkedAttractive={false /*TODO: add*/}
                                navigation={navigation}
                                api={api}
                            />)
                    })
                }

                <Seperator style={{ marginBottom: 50 }} />
                <TextBlock style={{ marginLeft: 15 }}>{language.FRIENDS.OUTGOING_FRIEND[currentLanguage]}:</TextBlock>
                <Seperator />

                {friendsOut === null || friendsPets === null || friendsOut.length === 0 || isLoading ? <TextBlock style={{ marginLeft: 15, marginTop: 15 }}>{language.FRIENDS.NO_REQUESTS[currentLanguage]} {friendsPets?.toString()}</TextBlock> :
                    friendsOut.map((friend: Relationship) => {
                        return (
                            <PetItem
                                key={friend.RELATIONID}
                                myPetID={route.params.petID}
                                pet={friendsPets.find(x => x.TIERID === friend.TIER_B_ID) as Pet}
                                isFriend={false}
                                hasRequested={false}
                                hasOwnRequest={true}
                                isMarkedAttractive={false /*TODO: add*/}
                                navigation={navigation}
                                api={api}
                            />)
                    })
                }
                <Seperator />
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
        backgroundColor: BLACK,
    },
    row: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "flex-start",
    },
});