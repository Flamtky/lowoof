import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Sidebar from './src/Components/sidebar';
import { EditProfile, EditPet } from './src/Screens/EditProfile';
import { BACKGROUNDCOLOR, TITLECOLOR } from './src/Constants/colors';
import { Chat } from './src/Screens/Chat';
import DeletePet from './src/Screens/DeletePet';
import language from './language.json';
import { Api } from './src/Api/lowoof-api';
import Login from './src/Screens/Login';
import Register from './src/Screens/Register';
import { currentLanguage } from './src/Constants/language';

const Stack = createNativeStackNavigator<any>();

export default function App() {
	const [login, setLogin] = React.useState<boolean>(false);
	return (
		<NavigationContainer>
			<Stack.Navigator>
				{!login ? (
					<Stack.Screen
						name="Login"
						component={Register}
						initialParams={{ setLogin }}
						options={{
							headerShown: false,
						}}
					/>) : (
					<>
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
						</Stack.Group>
					</>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
