import React, { Component } from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'

class Result extends Component {
    render () {
        return (
            <View style={ styles.container }>
                <Button style={ styles.button } title="Result">
                </Button>
            </View>
        )
    }
}

export default Result

const styles = StyleSheet.create({
    container: {
        padding: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
    }
})