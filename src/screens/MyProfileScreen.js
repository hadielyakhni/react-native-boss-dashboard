import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'

class MyProfileScreen extends Component {
  static navigationOptions = {
    headerTitle: 'My Profile'
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            AsyncStorage.clear()
            this.props.resetTasks()
            this.props.resetEmployees()
            this.props.resetAccounts()
            this.props.navigation.navigate('Login')
          }}
        >
          <Text style={styles.logoutText}>
            LOGOUT
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoutButton: {
    backgroundColor: '#008ee0',
    height: 50,
    width: 100,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
})

const mapDiaptchToProps = dispatch => ({
  resetTasks: () => dispatch({ type: 'logout_tasks_reset' }),
  resetEmployees: () => dispatch({ type: 'logout_employees_reset' }),
  resetAccounts: () => dispatch({ type: 'logout_accounts_reset' }),
})

export default connect(null, mapDiaptchToProps)(MyProfileScreen)