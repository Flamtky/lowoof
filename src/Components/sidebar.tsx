import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions, ScrollView} from 'react-native';
import SearchBar from './searchbar';

const Drawer = createDrawerNavigator();
const BACKGROUNDCOLOR = '#9fc8f9';
const MAINCOLOR = '#cae0f8';

function PageOne() {
    const dimensions = useWindowDimensions();
    return (
        <View style={[styles.item, styles.container, dimensions.width >= 768 ? {width: '60%'} : {width: "100%"}]}>
            <ScrollView style={{width: '100%'}}
            contentContainerStyle = {styles.item}
            keyboardDismissMode = "on-drag"
            >
                <View>
                    <Text>PageOne Screen</Text>
                </View>
            </ScrollView>
        </View>
    );
}
  
function PageTwo() {
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

export default function Sidebar() {
    const dimensions = useWindowDimensions();
    return (
        <Drawer.Navigator
            initialRouteName="PageOne"
            screenOptions={{
                drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
                drawerLabelStyle: {
                    marginEnd: 0,
                    marginRight: 0,
                },
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#000',
                drawerStyle: {
                    paddingLeft: dimensions.width >= 768 ? '20%': 0,
                    width: dimensions.width >= 768 ? "auto": "80%",
                    backgroundColor: BACKGROUNDCOLOR,
                },
                headerRight: () => (
                    <SearchBar/>
                ),
                headerStyle: {
                    backgroundColor: BACKGROUNDCOLOR,
                },
                sceneContainerStyle: {
                    backgroundColor: BACKGROUNDCOLOR,
                },
                // Hide hamburger icon if drawer is permanent
                headerLeftContainerStyle: dimensions.width >= 768 ? {
                    display: 'none',
                } : {},
            }}
            >
            <Drawer.Screen name="PageOne" component={PageOne}/>
            <Drawer.Screen name="PageTwo" component={PageTwo}/>
        </Drawer.Navigator>
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
  