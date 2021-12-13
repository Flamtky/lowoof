import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import SearchBar from './searchbar';
import MyProfile from '../Screens/MyProfile';
import Settings from '../Screens/Settings';
import { BACKGROUNDCOLOR, BLACK, TITLECOLOR, WHITE } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage as cl } from '../Constants/language';
import { API } from '../Constants/api';
import TopTen from '../Screens/TopTen';
import ReportList from '../Screens/ReportList';


const Drawer = createDrawerNavigator();

export default function Sidebar({ route, navigation } : any) {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    const [currentLanguage, setCurrentLanguage] = useState(cl);

    const setLogin = route.params.setLogin;

    React.useEffect(() => {
        setCurrentLanguage(cl);
    }, [cl]);
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
            <Drawer.Screen name="MyProfile" component={MyProfile} options={{ title: language.PROFILE.HEADER[currentLanguage] }} initialParams={{ userID: API.getCurrentUser()?.USERID ?? 0 }} />
            <Drawer.Screen name="TopTen" component={TopTen} options={{ title: language.TOPTEN.HEADER[currentLanguage] }} />
            {API.getCurrentUser()?.ADMIN ?
                <Drawer.Screen name="Reports" component={ReportList} options={{ title: "Report List"/* TODO: ADD LANGUAGE */ }} />
                : null}
            <Drawer.Screen name="Settings" component={Settings} options={{ title: language.SETTINGS.HEADER[currentLanguage]}} initialParams={{ setLogin }} />
        </Drawer.Navigator>
    );
}