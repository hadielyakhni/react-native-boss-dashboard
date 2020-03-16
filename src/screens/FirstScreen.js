import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { goToAuth, goToMain } from '../navigation/navigation'
import { Spinner } from 'native-base'

export class FirstScreen extends Component {
  componentDidMount() {
    this.tryAutomaticSignIn()
  }
  tryAutomaticSignIn = async () => {
    const uid = await AsyncStorage.getItem('uid')
    if (uid)
      goToMain()
    else
      goToAuth()
  }
  render() {
    return (
      <View style={styles.container}>
        <Spinner color='#008ee0' />
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
