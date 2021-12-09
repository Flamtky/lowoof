import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Sidebar from './src/Components/sidebar';
import { EditProfile, EditAnimal } from './src/Screens/EditProfile';
import { BACKGROUNDCOLOR, TITLECOLOR } from './src/Constants/colors';
import { Chat } from './src/Screens/Chat';
import DeleteAnimal from './src/Screens/DeleteAnimal';
import language from './language.json';

const Stack = createNativeStackNavigator<any>();

export let currentLanguage: "EN" | "DE" = 'EN';
export const setLanguage = (lang: "EN" | "DE") => {
	currentLanguage = lang;
};

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Root" component={Sidebar} options={{ headerShown: false }} />
				<Stack.Group screenOptions={{ presentation: 'modal' }}>
					<Stack.Screen name="EditProfile" component={EditProfile} options={{
						title: language.EDIT_PROFILE.HEADER[currentLanguage],
						headerStyle: {
							backgroundColor: BACKGROUNDCOLOR,
						},
						headerTitleStyle: {
							fontSize: 24,
							color: TITLECOLOR,
							fontWeight: "bold",
						},
					}} />
					<Stack.Screen name="EditPet" component={EditAnimal} options={{
						title: language.EDIT_PET.HEADER[currentLanguage],
						headerStyle: {
							backgroundColor: BACKGROUNDCOLOR,
						},
						headerTitleStyle: {
							fontSize: 24,
							color: TITLECOLOR,
							fontWeight: "bold",
						},
					}} />
					<Stack.Screen name="Chat" component={Chat} options={{
						title: language.CHATS.CHAT_WITH[currentLanguage] + "XY", //TODO: Replace XY with name
						headerStyle: {
							backgroundColor: BACKGROUNDCOLOR,
						},
						headerTitleStyle: {
							fontSize: 24,
							color: TITLECOLOR,
							fontWeight: "bold",
						},
					}} />
					<Stack.Screen name="DeletePet" component={DeleteAnimal} options={({route}) =>({
						title: route?.params?.name ?? language.EDIT_PET.DELETE[currentLanguage],
						headerStyle: {
							backgroundColor: BACKGROUNDCOLOR,
						},
						headerTitleStyle: {
							fontSize: 24,
							color: TITLECOLOR,
							fontWeight: "bold",
						},
					})} />
				</Stack.Group>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
