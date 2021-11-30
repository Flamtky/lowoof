import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions } from "react-native";
import { View, TextInput } from "react-native";

export default function SearchBar() {
    const dimensions = useWindowDimensions();
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={[styles.container, dimensions.width < 768 ? {right: '0%'} : {right: '42.5%'}, dimensions.width < 768 && isFocused ? {width: dimensions.width-42} : null]}>
            <TextInput
                style={styles.input}
                placeholder={"Suchen..."}
                placeholderTextColor="#666"
                returnKeyType="search"
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                spellCheck={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50%',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        backgroundColor: 'transparent',
        padding: 0,
        paddingLeft: 10,
        paddingRight: 10,
    },
});
