import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';

export function Chat(props: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [message, setMessage] = useState('');

    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : null]}>
                <ScrollView keyboardDismissMode='on-drag' style={{ height: "100%", width: "100%" }}>
                    {/*Messages*/}
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
                            console.log(message);
                            /* TODO: Handle message */

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
});