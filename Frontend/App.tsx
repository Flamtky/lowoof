import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Sidebar from './src/Components/sidebar';
import { EditProfile, EditPet, AddPet } from './src/Screens/EditProfile';
import { BACKGROUNDCOLOR, TITLECOLOR } from './src/Constants/colors';
import Chat from './src/Screens/Chat';
import DeletePet from './src/Screens/DeletePet';
import language from './language.json';
import { Api } from './src/Api/lowoof-api';
import Login from './src/Screens/Login';
import Register from './src/Screens/Register';
import { currentLanguage, setLanguage } from './src/Constants/language';
import PetProfile from './src/Screens/PetProfile';
import Report from './src/Screens/Report';
import { API } from './src/Constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Response } from './src/Api/interfaces';

const Stack = createNativeStackNavigator<any>();

export default function App() {
	const [login, setLogin] = React.useState<boolean>(false);
	AsyncStorage.getItem('language').then((res) => {
		if (res) {
			setLanguage(JSON.parse(res));
		}
	});
	React.useEffect(() => {
		let user = API.getCurrentUser();
		if (user) {
			API.getUserLanguage(user.USERID).then((res) => {
				if (!res.hasOwnProperty('message')) {
					setLanguage(res as any);
					AsyncStorage.setItem('language', JSON.stringify(res));
				} else {
					alert((res as Response).message);
					AsyncStorage.setItem('language', "EN");
				}
			});
		}
	}, [login]);
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{!login ? (
					<Stack.Group>
						<Stack.Screen
							name="Login"
							component={Login}
							initialParams={{ setLogin }}
							options={{
								headerShown: false,
							}} />
						<Stack.Screen
							name="Register"
							component={Register}
							initialParams={{ setLogin }}
							options={{
								headerShown: false,
							}} />
					</Stack.Group>
				) : (
					<>
						<Stack.Screen name="Root" component={Sidebar} options={{ headerShown: false }} />
						<Stack.Group screenOptions={{ presentation: 'modal' }}>
							<Stack.Screen name="PetProfile" component={PetProfile} options={{
								title: language.PET.HEADER[currentLanguage],
								headerStyle: {
									backgroundColor: BACKGROUNDCOLOR,
								},
								headerTitleStyle: {
									fontSize: 24,
									color: TITLECOLOR,
									fontWeight: "bold",
								},
							}} />
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
							<Stack.Screen name="EditPet" component={EditPet} options={{
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
							<Stack.Screen name="AddPet" component={AddPet} options={{
								title: language.EDIT_PET.HEADER[currentLanguage], // TODO: ADD NEW LANGUAGE
								headerStyle: {
									backgroundColor: BACKGROUNDCOLOR,
								},
								headerTitleStyle: {
									fontSize: 24,
									color: TITLECOLOR,
									fontWeight: "bold",
								},
							}} />
							<Stack.Screen name="Chat" component={Chat} options={({ route }) => ({
								title: route?.params?.name ?? language.CHATS.CHAT_WITH[currentLanguage] + "XY",
								headerStyle: {
									backgroundColor: BACKGROUNDCOLOR,
								},
								headerTitleStyle: {
									fontSize: 24,
									color: TITLECOLOR,
									fontWeight: "bold",
								},
							})} />
							<Stack.Screen name="DeletePet" component={DeletePet} options={({ route }) => ({
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
							<Stack.Screen name="Report" component={Report} options={({ route }) => ({
								title: route?.params?.name ?? "Report",
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
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
