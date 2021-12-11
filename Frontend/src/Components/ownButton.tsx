import React from 'react';
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { BLUE, WHITE } from '../Constants/colors';
import { TextBlock } from './styledText';

export default function OwnButton(props: any) {
    return <View style={[{ borderRadius: 5, minWidth: 100, width: "auto" }, props.style]}>
        <TouchableOpacity onPress={props.onPress}>
            <TextBlock style={styles.button}>{props.title}</TextBlock>
        </TouchableOpacity>
    </View>;
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: BLUE,
        padding: 10,
        color: WHITE,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold"
    }
});
