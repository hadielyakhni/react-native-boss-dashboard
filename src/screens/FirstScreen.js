import React, { Component } from 'react'
import { StyleSheet, View, AsyncStorage } from 'react-native'
import { Spinner } from 'native-base'

export class FirstScreen extends Component {
  componentDidMount() {
    this.tryAutomaticSignIn()
  }
  tryAutomaticSignIn = async () => {
    const uid = await AsyncStorage.getItem('uid')
    if (uid)
      this.props.navigation.navigate('Main')
    else
      this.props.navigation.navigate('Auth')
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
