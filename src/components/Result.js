import React, { Component } from 'react'
import { StyleSheet, View, Text, Button, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import firebase from '../helper/firebase'

const database = firebase.database()
const storage = firebase.storage()

class Result extends Component {

    constructor(props) {
        super(props)
        this.state = {
            leaf_name: '',
            leaf_url: ''
        }
    }

    componentWillMount() {
        database.ref('leave_type').child(this.props.result).once('value').then((snap) => {
            let leaf = snap.val()
            this.setState({
                leaf_name: leaf
            })
        })
        storage.ref('show_images').child(`${this.props.result}.jpg`).getDownloadURL().then((url) => {
            this.setState({
                leaf_url: {uri: url}
            })
        })
        
    }

    render () {
        // let Image_Http_URL ={ uri: this.state.leaf_url};
        console.log('Render with', this.state.leaf_url)
        // console.log('Get download url',storage.ref('show_images').child(`${this.props.result}.jpg`).getDownloadURL())
        return (
            <View style={ styles.container }>
                <Image style={styles.showImage} source={this.state.leaf_url}/>
                <Text style={styles.baseText}> {this.state.leaf_name} </Text>
                <Button style={ styles.button } title="Back" onPress={() => {Actions.pop()}}>
                </Button>
            </View>
        )
    }
}

export default Result

const styles = StyleSheet.create({
    baseText: {
        fontFamily: 'Cochin',
    },
    container: {
        padding: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
    },
    showImage : {
        width: 300,
        height: 300
    }
})