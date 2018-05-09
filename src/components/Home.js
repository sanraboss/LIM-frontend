import React, { Component } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import { Actions } from 'react-native-router-flux'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import firebase from '../helper/firebase'
import axios from 'axios'

const storageRef = firebase.storage().ref()


const uploadImage = (uri, mime = 'application/octet-stream') => {
    // Prepare Blob support
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob
    return new Promise((resolve, reject) => {
        // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        
        const sessionId = new Date().getTime()
        let uploadBlob = null
        const imageRef = storageRef.child(`images/${sessionId}.jpeg`)

        fs.readFile(uri, 'base64')
        .then((data) => {
            return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
            uploadBlob = blob
            return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
            uploadBlob.close()
            return imageRef.getDownloadURL()
        })
        .then((url) => {
            console.log('url:' + url)
            resolve(url)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            uploadURL : ''
        }
    }

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
            // console.log('Response = ', response);

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
                uploadImage(response.uri)
                .then(url => this.setState({ uploadURL: url },() => {
                    axios.post('http://d4ec5283.ngrok.io/get-leave-name', {
                        url: this.state.uploadURL
                    }).then((response) => {
                        Actions.Result({result: response.data})
                    }).catch((error) => {
                        console.log('axios error', error)
                    })
                }))
                .catch(error => console.log(error))
                // const metadata = {
                //     contentType: 'image/jpeg',
                //   };
                // console.log(response)
                // const uploadTask = storageRef.child(`images/${response.fileName}`).put(new File(response.data, response.fileName), metadata)
                // uploadTask.on('state_changed', function(snapshot){
                //     // Observe state change events such as progress, pause, and resume
                //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                //     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                //     console.log('Upload is ' + progress + '% done');
                //     switch (snapshot.state) {
                //       case firebase.storage.TaskState.PAUSED: // or 'paused'
                //         console.log('Upload is paused');
                //         break;
                //       case firebase.storage.TaskState.RUNNING: // or 'running'
                //         console.log('Upload is running');
                //         break;
                //     }
                //   }, function(error) {
                //     // Handle unsuccessful uploads
                //   }, function() {
                //     // Handle successful uploads on complete
                //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                //     uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                //       console.log('File available at', downloadURL)
                //     })
                //   })
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