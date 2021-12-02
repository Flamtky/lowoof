import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import SearchBar from './searchbar';
import MeinProfil from '../Screens/MeinProfil';
import Tierprofil from '../Screens/Tierprofil';
import Matches from '../Screens/Matches';
import Freunde from '../Screens/Freunde';
import Chats from '../Screens/Chats';
import Einstellungen from '../Screens/Einstellungen';
import { BACKGROUNDCOLOR, TITLECOLOR } from '../Constants/colors';

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
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#000',
                drawerStyle: {
                    paddingLeft: isLargeScreen ? '20%' : 0,
                    width: isLargeScreen ? "auto" : "80%",
                    backgroundColor: BACKGROUNDCOLOR,
                },
                swipeEdgeWidth: dimensions.width,
                headerRight: () => (
                    <SearchBar />
                ),
                headerStyle: {
                    backgroundColor: BACKGROUNDCOLOR,
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
            <Drawer.Screen name="Mein Profil" component={MeinProfil} />
            <Drawer.Screen name="Tierprofil" component={Tierprofil} />
            <Drawer.Screen name="Matches" component={Matches} />
            <Drawer.Screen name="Freunde" component={Freunde} />
            <Drawer.Screen name="Chats" component={Chats} />
            <Drawer.Screen name="Einstellungen" component={Einstellungen} />
        </Drawer.Navigator>
    );
}