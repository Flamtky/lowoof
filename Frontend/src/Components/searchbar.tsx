import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions } from "react-native";
import { View, TextInput } from "react-native";
import { BLACK, GRAY, LIGHTGRAY } from '../Constants/colors';

export default function SearchBar() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={[styles.container, !isLargeScreen && isFocused ? { width: "100%", height: "60%" } : null]}>
            <TextInput
                style={styles.input}
                placeholder={"Suchen..."}
                placeholderTextColor={GRAY}
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
        backgroundColor: LIGHTGRAY,
        paddingVertical: 2,
        borderRadius: 5,
        flexDirection: 'row',
        height: '50%',
    },
    input: {
        width: '100%',
        fontSize: 16,
        color: BLACK,
        paddingHorizontal: 10,
    },
});
