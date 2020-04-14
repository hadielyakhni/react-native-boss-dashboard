import React, { Component } from 'react'
import { StyleSheet, View, StatusBar } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { goToAuth, goToMain } from '../navigation/navigation'
import { connect } from 'react-redux'
import { getTasksSortData, getEmployeesSortData, getAccountsSortData, setTheme } from '../actions'
import { GoogleSignin } from '@react-native-community/google-signin'
import { Appearance } from 'react-native-appearance'
import { Navigation } from 'react-native-navigation'
import Keys from '../keys/google'

GoogleSignin.configure({
  webClientId: Keys.webClientId
});

class FirstScreen extends Component {
  componentDidMount() {
    this.configureTheme()
    this.tryAutomaticSignIn()
  }
  async configureTheme() {
    const theme = await AsyncStorage.getItem('theme')
    let themeToSet
    switch (theme) {
      case 'system':
      case null:
        if (!theme) {
          AsyncStorage.setItem('theme', 'system')
        }
        if (Appearance.getColorScheme() === 'no-preference') {
          this.props.setTheme('light', 'isSystem')
          themeToSet = 'light'
        }
        else {
          this.props.setTheme(Appearance.getColorScheme(), 'isSystem')
          themeToSet = Appearance.getColorScheme()
        }
        break
      case 'dark':
        this.props.setTheme('dark')
        themeToSet = 'dark'
        break
      case 'light':
        this.props.setTheme('light')
        themeToSet = 'light'
        break
    }
    Navigation.setDefaultOptions({
      layout: {
        orientation: ["portrait"]
      },
      bottomTab: {
        iconColor: themeToSet === 'light' ? '#c0c9d3' : '#c8d2da',
        selectedIconColor: '#008ee0',
        fontFamily: 'SourceSansPro-Regular',
        selectedFontSize: 13.5,
        fontSize: 11,
        selectedTextColor: '#008ee0',
      },
      bottomTabs: {
        backgroundColor: themeToSet === 'light' ? '#fbfbfb' : '#161616'
      },
      statusBar: {
        backgroundColor: themeToSet === 'light' ? '#fbfbfb' : '#161616',
        style: themeToSet === 'light' ? 'dark' : 'light'
      }
    })
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

export default connect(({ app }) => ({ theme: app.theme }), {
  getTasksSortData,
  getEmployeesSortData,
  getAccountsSortData,
  setTheme
})(FirstScreen)