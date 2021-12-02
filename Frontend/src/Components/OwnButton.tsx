import React from 'react';
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { BLUE, WHITE } from '../Constants/colors';
import { TextBlock } from './styledText';

// TODO: Add type for props
export default function OwnButton(props:any) {
    return <View style={{ width: 200, alignSelf: "center", marginTop: 20 }}>
        <TouchableOpacity onPress={() => { }}>
            <TextBlock style={styles.button}>{props.title}</TextBlock>
        </TouchableOpacity>
    </View>;
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: BLUE,
        padding: 10,
        borderRadius: 5,
        color: WHITE,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold"
    }
});
