import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  Scene,
  Stack,
  Router,
} from 'react-native-router-flux';
import Home from '../Home'
import Result from '../Result'

const App = () => {
    return (
        <Router>
            <Scene key="root">
                <Scene key="Home" component={Home} hideNavBar={1} initial />
                <Scene key="Result" component={Result} hideNavBar={1} />
            </Scene>
        </Router>
    )
}

export default App