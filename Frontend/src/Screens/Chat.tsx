import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { Message, Pet } from '../Api/interfaces';
import { TextBlock } from '../Components/styledText';
import { API } from '../Constants/api';

export default function Chat({ route, navigation }: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [message, setMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const [messages, setMessages] = useState<string[]>([]);
    const [targetPet, setTargetPet] = useState<Pet | null>(null);
    const targetID = route.params.targetPet;
    const ownID = route.params.ownPet;


    //TODO: FIX DESIGN (ALLWAYS RIGHT SIDE)

    React.useEffect(() => {
        if (targetID == undefined) {
            navigation.navigate('MyProfile');
        } else {
            // Get the message history from the server
            API.getMessages(ownID, targetID).then((data) => {
                if (!data.hasOwnProperty("message")) {
                    setMessageHistory(data as Message[]);
                    (data as Message[]).forEach((message) => {
                        setMessages(messages => [...messages, message.NACHRICHT]);
                    });
                } else {
                    console.log(data);
                }
            });
            API.getPetData(targetID).then((data) => {
                if (!data.hasOwnProperty("message")) {
                    setTargetPet(data as Pet);
                    navigation.setParams({ name: "Chat with " + (data as Pet).NAME })
                } else {
                    console.log(data);
                } 
            }); 
        }
    }, [targetID, ownID]);

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : null]}>
                <ScrollView keyboardDismissMode='on-drag' style={{ height: "100%", width: "100%" }}>
                    {messages.map((messageObj, index) => {
                        const mess:Message|undefined = messageHistory.find(m => m.NACHRICHT === messageObj);
                        return (
                            <View key={"Message-" + index} style={[styles.messageContainer, mess === undefined || mess.FROM_PET === ownID.TIERID ? {marginRight: "auto"} : { alignItems: 'flex-end', marginLeft: "auto" } ]}>
                                <TextBlock style={styles.messageText}>{messageObj}</TextBlock>
                            </View>
                        )
                    })}
                </ScrollView>
                <View style={{ width: "100%", flexDirection: 'row' }}>
                    <SearchBar
                        placeholder={language.CHATS.MESSAGE[currentLanguage]}
                        style={styles.input}
                        value={message}
                        onChange={(event: any) => {
                            setMessage(event.nativeEvent.text);
                        }}
                    />
                    <OwnButton
                        title="➤"
                        style={{ width: 40, padding: 0, minWidth: 0, borderRadius: 0 }}
                        onPress={() => {
                            API.sendMessage(ownID, targetID, message).then((resp) => { 
                                if (resp.status === 200) {
                                    setMessages([...messages, message]);
                                    setMessage('');
                                } else {
                                    console.log(resp);
                                    alert(resp.message);
                                }
                            });

                            // Clears the input
                            setMessage('');
                        }}
                    />
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
    input: {
        height: 42,
        width: 32,
        flexGrow: 1,
        borderRadius: 0,
    },
    messageContainer: {
        width: "auto",
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginBottom: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: "#000",
    }
});