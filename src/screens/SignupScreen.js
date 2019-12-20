import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Text,
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { Spinner } from 'native-base'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'
import { emailChanged, passwordChanged, userSignup, resetAuth } from '../actions'

class SignupScreen extends Component {
  constructor() {
    super()
    this.keyboardDidShowListner = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListner = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    this.state = {
      isKeyboardOpened: false
    }
  }
  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpened: true })
  }
  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpened: false })
  }
  onSignup = () => {
    const { email, password, userSignup } = this.props
    userSignup(email, password)
  }
  renderSignupButton() {
    if (!this.props.loading)
      return (
        <MyButton
          style={{ marginTop: 15, marginBottom: 10 }}
          onPress={this.onSignup.bind(this)}
        >
          Sign Up
      </MyButton>
      )
    return (
      <View style={styles.loadingContainer}>
        <Spinner color='#fff' size={33} />
      </View>
    )
  }
  renderError() {
    if (this.props.error != '')
      return (
        <View>
          <Text style={styles.errorStyle}>
            {this.props.error}
          </Text>
        </View>
      )
    return <View style={{ height: 20 }} />
  }
  render() {
    const { email, password, emailChanged, passwordChanged } = this.props
    return (
      <View style={styles.container}>
        <View style={{ paddingBottom: this.state.isKeyboardOpened ? 320 : 100 }}>
          <Text style={[styles.title, { marginBottom: 0 }]}>
            Organize
          </Text>
          <Text style={[styles.title, { fontSize: 52 }]}>
            Your Life!
          </Text>
          <MyInput
            keyboardType='email-address'
            value={email}
            isSecure={false}
            placeHolder='Email'
            isAutoCorrect={true}
            onChangeText={text => emailChanged(text)}
          />
          <MyInput
            value={password}
            isSecure={true}
            placeHolder='Password'
            isAutoCorrect={false}
            onChangeText={text => passwordChanged(text)}
          />
          {this.renderSignupButton()}
          <MyButton
            style={{ marginTop: 15, marginBottom: 10 }}
          >
            Sign Up with facebook
          </MyButton>
          <View style={styles.signupOption}>
            <Text style={styles.signupText}>
              Already have an account?
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.resetAuth()
                this.props.navigation.navigate('Login')
              }}
            >
              <Text style={styles.signupLink}>
                Log in.
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ height: 72, justifyContent: 'center' }}>
            {this.renderError()}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 33,
    justifyContent: 'center'
  },
  title: {
    marginBottom: 35,
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  signupOption: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signupText: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 4
  },
  signupLink: {
    color: '#fff',
    fontSize: 12.5,
    fontWeight: 'bold'
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#008ee0',
    alignItems: 'center',
    height: 45,
    borderRadius: 5,
    justifyContent: 'center'
  },
  errorStyle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#e64749',
    paddingLeft: 7
  }
})

const mapActionsToProps = dispatch => ({
  emailChanged: (email) => dispatch(emailChanged(email)),
  passwordChanged: (password) => dispatch(passwordChanged(password)),
  userSignup: (email, password) => dispatch(userSignup(email, password)),
  resetAuth: () => dispatch(resetAuth())
})

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    password: state.auth.password,
    loading: state.auth.loading,
    error: state.auth.error
  }
}

export default connect(mapStateToProps, mapActionsToProps)(SignupScreen)