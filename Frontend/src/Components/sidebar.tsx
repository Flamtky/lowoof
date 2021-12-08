import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import SearchBar from './searchbar';
import Profile from '../Screens/MeinProfil';
import Tierprofil from '../Screens/Tierprofil';
import Matches from '../Screens/Matches';
import Freunde from '../Screens/Freunde';
import Chats from '../Screens/Chats';
import Einstellungen from '../Screens/Einstellungen';
import { BACKGROUNDCOLOR, BLACK, TITLECOLOR, WHITE } from '../Constants/colors';
import ImagePickerExample from '../Screens/test';

const Drawer = createDrawerNavigator();

export default function Sidebar() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <Drawer.Navigator
            initialRouteName="Mein Profil"
            screenOptions={{
                drawerType: isLargeScreen ? 'permanent' : 'front',
                drawerLabelStyle: {
                    marginEnd: 0,
                    marginRight: 0,
                },
                drawerActiveTintColor: WHITE,
                drawerInactiveTintColor: BLACK,
                drawerStyle: {
                    paddingLeft: isLargeScreen ? '20%' : 0,
                    width: isLargeScreen ? "auto" : "80%",
                    backgroundColor: BACKGROUNDCOLOR,
                    borderRightWidth: 0,
                },
                swipeEdgeWidth: dimensions.width,
                headerRight: () => (
                    <SearchBar mobileStyle={{ width: "100%", height: "60%" }} />
                ),
                headerRightContainerStyle: {
                    right: isLargeScreen ? "40%" : "10%",
                },
                headerStyle: {
                    backgroundColor: BACKGROUNDCOLOR,
                    borderBottomWidth: 0,
                },
                headerTitleStyle: {
                    fontSize: 24,
                    color: TITLECOLOR,
                    fontWeight: "bold"
                },
                sceneContainerStyle: {
                    backgroundColor: BACKGROUNDCOLOR,
                },
                // Hide hamburger icon if drawer is permanent
                headerLeftContainerStyle: isLargeScreen ? {
                    display: 'none',
                } : {},
            }}
            backBehavior='history'
        >
            <Drawer.Screen name="Mein Profil" component={Profile} initialParams={{ userID: 10 /* TODO: Give current UserID */ }} />
            <Drawer.Screen name="Tierprofil" component={Tierprofil} />
            <Drawer.Screen name="ImagePickerExample" component={ImagePickerExample} />
            <Drawer.Screen name="Matches" component={Matches} />
            <Drawer.Screen name="Freunde" component={Freunde} />
            <Drawer.Screen name="Chats" component={Chats} />
            <Drawer.Screen name="Einstellungen" component={Einstellungen} />
        </Drawer.Navigator>
    );
}