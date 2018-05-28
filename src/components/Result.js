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
        console.disableYellowBox = true
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
        return (
            <View style={ styles.container }>
                <Image style={styles.showImage} source={this.state.leaf_url}/>
                <Text style={styles.baseText}> {this.state.leaf_name} </Text>
                <Button style={ styles.button } title="Back" onPress={() => {Actions.pop()}}>
                </Button>
                <Image style={styles.backgroundImage} source={require('../assets/background.png')}/>
            </View>
        )
    }
}

export default Result

const styles = StyleSheet.create({
    baseText: {
        fontFamily: 'Cochin',
        fontSize: 24
    },
    header: {
        alignSelf: 'center',
        marginBottom: 20
    },
    container: {
        padding: 50,
        justifyContent: 'center',
        alignItems: 'center'
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
    showImage : {
        width: 300,
        height: 300
    },
    backgroundImage: {
        position: 'absolute',
        zIndex: -1
    }
})