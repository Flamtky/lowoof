import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import Sidebar from './src/Components/sidebar';
import EditProfile from './src/Screens/EditProfile';
import { BACKGROUNDCOLOR, TITLECOLOR } from './src/Constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Root: undefined;
  EditProfile: undefined;
  NotFound: undefined;
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Root" component={Sidebar} options={{ headerShown: false }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ 
			title: 'Profil bearbeiten',
			headerStyle: {
				backgroundColor: BACKGROUNDCOLOR,
        	},
			headerTitleStyle: {
				fontSize: 24,
				color: TITLECOLOR,
				fontWeight: "bold",
			},
		}}/>
      </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
