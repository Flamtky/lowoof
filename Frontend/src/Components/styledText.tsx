import React from "react";
import { Text } from 'react-native';

export function TextBlock(props: Text["props"]) {
    return <Text{...props} style={[props.style, {fontFamily:"sans-serif"}]}/>;
}