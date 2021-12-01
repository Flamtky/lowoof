import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { useWindowDimensions} from 'react-native';
import SearchBar from './searchbar';
import PageOne from '../Screens/PageOne';
import PageTwo from '../Screens/PageTwo';
import { BACKGROUNDCOLOR } from '../Constants/colors';

const Drawer = createDrawerNavigator();

//TODO: Create constants for large screen (dimensions.width >= 768 ), maybe constant folder?
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