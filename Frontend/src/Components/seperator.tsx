import React from "react";
import { StyleSheet, View } from "react-native";


export default function Seperator(props: any) {
    return <View style={[styles.seperator, { backgroundColor: props.color ?? "#000" }, props.style]} />
}

const styles = StyleSheet.create({
    seperator: {
        height: 1,
        width: "100%",
        marginVertical: 10,
    }
});