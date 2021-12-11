import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import SearchBar from './searchbar';
import MyProfile from '../Screens/MyProfile';
import Matches from '../Screens/Matches';
import Friends from '../Screens/Friends';
import Chats from '../Screens/Chats';
import Settings from '../Screens/Settings';
import { BACKGROUNDCOLOR, BLACK, TITLECOLOR, WHITE } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';
import { API } from '../Constants/api';


const Drawer = createDrawerNavigator();

export default function Sidebar() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <Drawer.Navigator
            initialRouteName="MyProfile"
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
            <Drawer.Screen name="MyProfile" component={MyProfile} options={{ title: language.PROFILE.HEADER[currentLanguage] }} initialParams={{ userID: API.getCurrentUser()?.USERID ?? 0}} />
            <Drawer.Screen name="Matches" component={Matches} options={{ title: language.MATCHES.HEADER[currentLanguage] }} initialParams={{ petID: 195 /* TODO: Give current UserID */ }} />
            <Drawer.Screen name="Friends" component={Friends} options={{ title: language.FRIENDS.HEADER[currentLanguage] }} initialParams={{ petID: 195 /* TODO: Give current UserID */ }} />
            <Drawer.Screen name="Chats" component={Chats} options={{ title: language.CHATS.HEADER[currentLanguage] }} />
            <Drawer.Screen name="Settings" component={Settings} options={{ title: language.SETTINGS.HEADER[currentLanguage] }}/>
        </Drawer.Navigator>
    );
}