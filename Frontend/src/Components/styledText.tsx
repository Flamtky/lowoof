import React from "react";
import { Platform, Text } from 'react-native';

export function TextBlock(props: Text["props"]) {
    const doesntSupportsArial = Platform.OS === 'android';

    return <Text{...props} style={[props.style, { fontFamily: doesntSupportsArial ? "sans-serif" : "Arial" }]} />;
}