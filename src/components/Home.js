import React, { Component } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { Actions } from 'react-native-router-flux'
import ImagePicker from 'react-native-image-picker'

class Home extends Component {

    switchPage() {
        Actions.Result()
    }

    showCameraRoll() {
        var options = {
            title: 'Select leaf',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
            console.log('User cancelled image picker');
            }
            else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            }
            else {
                console.log('in')
            }
        });
    }

    render () {
        return (
            <View style={ styles.container }>
                <Button style={ styles.button } onPress={ () => this.showCameraRoll() } title="YEDKAE">
                </Button>
            </View>
        )
    }
}

export default Home

const styles = StyleSheet.create({
    container: {
        padding: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
    }
})