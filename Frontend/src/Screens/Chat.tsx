import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { Pet } from '../Api/interfaces';
import { TextBlock } from '../Components/styledText';
import { API } from '../Constants/api';

export function Chat(props: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [message, setMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState<Message[]>([]);
    const targetPet: Pet = props.targetPet;
    const ownPet: Pet = props.ownPet;


    //TODO: Test everything

    React.useEffect(() => {
        if (targetPet == undefined) {
            props.navigation.navigate('MyProfile');
        } else {
            // Get the message history from the server
            API.getMessages(ownPet.TIERID, targetPet.TIERID).then((data) => {
                if (!data.hasOwnProperty("message")) {
                    setMessageHistory(data);
                } else {
                    alert(data);
                }
            });
            props.navigation.setParams({ name: "Chat with " + targetPet.NAME })
        }
    }, [targetPet, ownPet]);

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : null]}>
                <ScrollView keyboardDismissMode='on-drag' style={{ height: "100%", width: "100%" }}>
                    {messageHistory.map((messageObj, index) => {
                        return (
                            <View key={"Message-" + index} style={[styles.messageContainer, messageObj.From === ownPet.TIERID ? { justifyContent: 'flex-end' } : null]}>
                                <TextBlock style={styles.messageText}>{message}</TextBlock>
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
                            console.log("=>" + message);
                            API.sendMessage(message, ownPet.TIERID, targetPet.TIERID).then((resp) => { //TODO: Change API Call, waiting for update
                                if (resp.message === "/* TODO:  ADD*/") {
                                    setMessageHistory([...messageHistory, message]);
                                    setMessage('');
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
        width: "100%",
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: "#000",
    }
});