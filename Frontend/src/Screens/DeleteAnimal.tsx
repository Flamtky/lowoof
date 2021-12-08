import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Pet } from '../Api/interfaces';
import { Api } from '../Api/lowoof-api';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';

export default function DeleteAnimal({ navigation, route }: any) {
    const dimensions = useWindowDimensions();
    const props = route.params;
    const isLargeScreen = dimensions.width >= 768;
    const api: Api = props.api;
    const petToDelete: Pet = props.petToDelete;
    const [password, setPassword] = React.useState('');
    React.useEffect(() => {
        navigation.setParams({ name: petToDelete.NAME + " löschen" })
        if (petToDelete === undefined) {
            props.navigation.navigate('Mein Profil');
        }
    }, [petToDelete]);
    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : { width: "100%" }]}>
                <View style={styles.innerContainer}>
                    <Text style={{ alignSelf: 'center', fontSize: 16 }}>Soll wirklich <Text style={styles.name}>'{petToDelete.NAME}'</Text> gelöscht werden?</Text>
                    <SearchBar
                        placeholder="Password..."
                        style={styles.input}
                        value={password}
                        onChange={(event: any) => {
                            setPassword(event.nativeEvent.text);
                        }}
                    />
                    <OwnButton title="Löschen" onPress={() => {
                        api.deletePet(petToDelete.TIERID, password).then((resp) => {
                            if (resp.message === "Wrong Password") {
                                alert("Falsches Passwort");
                            } else if (resp.message === "Pet deleted") {
                                alert("Tier gelöscht");
                                window.location.reload();
                            } else {
                                console.log(resp);
                            }
                        });
                    }} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAINCOLOR,
        alignItems: 'center',
        justifyContent: 'center',
        height: "100%"
    },
    name: {
        fontWeight: 'bold'
    },
    input: {
        height: 42,
        width: "100%",
        flexGrow: 1,
        borderRadius: 0,
    },
    innerContainer: {
        alignSelf: 'center',
        paddingHorizontal: 20,
        width: "100%",
    }
});