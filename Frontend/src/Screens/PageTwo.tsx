import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions, ScrollView} from 'react-native';
import { MAINCOLOR } from '../Constants/colors';

export default function PageTwo() {
    //TODO: Is this right? Currently we have to use this line in every function. (duplicate code)
    const dimensions = useWindowDimensions();
    return (
        <View style={[styles.item, styles.container, dimensions.width >= 768 ? {width: '60%'} : {width: "100%"}]}>
            <ScrollView style={{width: '100%'}}
            contentContainerStyle = {styles.item}
            keyboardDismissMode = "on-drag"
            >
                <View>
                    <Text>PageTwo Screen</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: MAINCOLOR,
    },
    item: {
       justifyContent: 'center',
       alignItems: 'center',
       flex:1,
    }
});