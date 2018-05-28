import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, Dimensions, TouchableOpacity, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import firebase from '../helper/firebase'
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay';
import {BASE_API} from '../helper/const'

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
            uploadURL : '',
            isLoading: false
        }
    }

    componentWillMount() {
        console.disableYellowBox = true
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
        }

        ImagePicker.showImagePicker(options, (response) => {

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
                this.setState({
                    isLoading: true
                })
                uploadImage(response.uri)
                .then(url => this.setState({ uploadURL: url },() => {
                    axios.post(`${BASE_API}/get-leave-name`, {
                        url: this.state.uploadURL
                    }).then((response) => {
                        this.setState({
                            isLoading: false
                        }, () => {
                            Actions.Result({result: response.data})
                        })
                    }).catch((error) => {
                        console.log('axios error', error)
                    })
                }))
                .catch(error => console.log(error))
            }
        });
    }

    render () {
        return (
            <View style={ styles.container }>
                <Spinner textStyle={{ color: 'red' }} visible= {this.state.isLoading} textContent="Waiting for result..."/>
                <View style={ styles.header }>
                    <Text style={{ fontSize: 44 }}>Welcome to</Text>
                    <Text style={{ fontSize: 44, alignSelf: 'center' }}>"LIM"{'\n'}</Text>
                    <Text style={{ fontSize: 24, alignSelf: 'center' }}>Leaf Identification{'\n'}  in Mobile Device{'\n'}</Text>
                </View>
                <View style={ styles.content }>
                    <View>
                        <Text style={{ fontSize: 24 }}>      Here is how to take{'\n'}            a leaf photo{'\n'}{'\n'}1. Pick the leaf{'\n'}2. Put a petiole out{'\n'}3. Lay the leaf{'\n'}    on A4 paper{'\n'}4. Capture in length to{'\n'}    cover all A4 paper</Text>
                    </View>
                </View>
                <Image style={styles.backgroundImage} source={require('../assets/background.png')}/>
                <TouchableOpacity style={ styles.button } onPress={ () => this.showCameraRoll() }>
                    <Text style={{ fontSize: 28 }}>START!</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        padding: 50,
        alignItems: 'center'
    },
    header: {
        alignSelf: 'center',
        marginBottom: 20,
        fontWeight: 'bold'
    },
    content: {
        alignItems: 'flex-start',
        marginLeft: 10,
        width: '90%',
        fontWeight: 'bold'
    },
    button: {
        position: 'absolute',
        bottom: 0,
        width: '90%',
        height: '15%',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6666ff'
    },
    backgroundImage: {
        position: 'absolute',
        zIndex: -1
    }
})