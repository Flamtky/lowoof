import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Pet } from '../Api/interfaces';
import { Api } from '../Api/lowoof-api';
import OwnButton from '../Components/ownButton';
import SearchBar from '../Components/searchbar';
import { BACKGROUNDCOLOR, MAINCOLOR } from '../Constants/colors';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';

export default function DeletePet({ navigation, route }: any) {
    const dimensions = useWindowDimensions();
    const props = route.params;
    const isLargeScreen = dimensions.width >= 768;
    const api: Api = props.api;
    const petToDelete: Pet = props.petToDelete;
    const [password, setPassword] = React.useState('');
    React.useEffect(() => {
        navigation.setParams({ name: petToDelete.NAME + " " + language.DELETE[currentLanguage].toLowerCase() })
        if (petToDelete == undefined) {
            props.navigation.navigate('MyProfile');
        }
    }, [petToDelete]);
    return (
        <View style={{ backgroundColor: BACKGROUNDCOLOR, height: "100%" }}>
            <View style={[styles.container, isLargeScreen ? { width: '43%', left: "28%" } : { width: "100%" }]}>
                <View style={styles.innerContainer}>
                    <Text style={{ alignSelf: 'center', fontSize: 16 }}>{language.EDIT_PET.CONFRIM_DELETE[currentLanguage]} <Text style={styles.name}>'{petToDelete.NAME}'</Text></Text>
                    <SearchBar
                        placeholder={language.PLACEHOLDER.PASSWORD[currentLanguage]}
                        style={styles.input}
                        value={password}
                        onChange={(event: any) => {
                            setPassword(event.nativeEvent.text);
                        }}
                        secureTextEntry={true}
                    />
                    <OwnButton title={language.DELETE[currentLanguage]} onPress={() => {
                        api.deletePet(petToDelete.TIERID, password).then((resp) => {
                            if (resp.message === "Wrong Password") {
                                alert(language.ERROR.WRONG_PWD[currentLanguage]);
                            } else if (resp.message === "Pet deleted") {
                                alert(language.EDIT_PET.SUCCESS_DELETE[currentLanguage]);
                                props.navigation.navigate('MyProfile');
                            } else {
                                console.log(resp);
                            }
                            setPassword('');
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