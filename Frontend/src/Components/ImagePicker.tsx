//https://docs.expo.dev/versions/latest/sdk/imagepicker/
import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import language from '../../language.json';
import { currentLanguage } from '../Constants/language';

export default function ImagePickerField(props:any) {
    const [image, setImage] = useState("");

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert(language.IMAGE_PICKER.NEED_PERM[currentLanguage]);
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.cancelled) {
            props.onChange(result.uri);
            setImage(result.uri);
        }
    };

    return (
        <View style={{alignItems: 'center', justifyContent: 'center' }}>
            <Button title={props.title ?? language.IMAGE_PICKER.PICK_IMAGE[currentLanguage]} onPress={pickImage} color={"#0f70e6"}/>
            {image && (props.showPreview ?? true) ? <Image source={{ uri: image }} style={{ width: 32, height: 32 }} /> : <></>}
        </View>
    );
}
