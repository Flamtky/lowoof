import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions } from "react-native";
import { View, TextInput } from "react-native";
import { BLACK, GRAY, LIGHTGRAY } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';


export default function SearchBar(props: any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={[styles.container, !isLargeScreen && isFocused ? props.mobileStyle : {}, props.style]}>
            <TextInput
                style={styles.input}
                placeholder={props.placeholder || language.PLACEHOLDER.Search[currentLanguage]}
                placeholderTextColor={GRAY}
                returnKeyType="search"
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                spellCheck={false}
                onChange={props.onChange}
                value={props.value}
                secureTextEntry={props.secureTextEntry}
                keyboardType={props.keyboardType}
                maxLength={props.maxLength}
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
