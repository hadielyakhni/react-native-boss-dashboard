import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { goToAuth, goToMain } from '../navigation/navigation'
import { connect } from 'react-redux'
import { getTasksSortData, getEmployeesSortData, getAccountsSortData } from '../actions'
import { GoogleSignin } from '@react-native-community/google-signin'
import Keys from '../keys/google'

GoogleSignin.configure({
  webClientId: Keys.webClientId
});

class FirstScreen extends Component {
  componentDidMount() {
    this.tryAutomaticSignIn()
  }
  tryAutomaticSignIn = async () => {
    const uid = await AsyncStorage.getItem('uid')
    if (uid) {
      this.props.getTasksSortData(uid)
      this.props.getEmployeesSortData(uid)
      this.props.getAccountsSortData(uid)
      goToMain()
    }
    else
      goToAuth()
  }
  render() {
    return (
      <View style={styles.container}>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default connect(null, {
  getTasksSortData,
  getEmployeesSortData,
  getAccountsSortData
})(FirstScreen)