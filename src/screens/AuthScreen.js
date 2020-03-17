import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { Spinner } from 'native-base'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'
import { userSignin, userSignup } from '../actions'

class AuthScreen extends Component {
  constructor() {
    super()
    this.keyboardDidShowListner = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListner = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    this.state = {
      screen: 'login',
      email: '',
      password: '',
      isKeyboardOpened: false
    }
  }
  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpened: true })
  }
  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpened: false })
  }
  onSign = () => {
    const { screen, email, password } = this.state
    if (screen === 'login')
      return this.props.userSignin(email, password)
    this.props.userSignup(email, password)
  }
  renderSignButton() {
    if (!this.props.loading)
      return (
        <MyButton
          style={{ marginTop: 15, marginBottom: 10 }}
          color='#008ee0'
          disabledColor='#355973'
          disabled={!this.state.email || !this.state.password}
          onPress={this.onSign.bind(this)}
        >{this.state.screen === 'login' ? 'Log In' : 'Sign Up'}</MyButton>
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
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <Text style={styles.title}>Hadi's Top</Text>
          <View style={{ paddingHorizontal: 33 }}>
            <MyInput
              keyboardType='email-address'
              value={this.state.email}
              style={{ paddingHorizontal: 15 }}
              isSecure={false}
              placeHolder='Email'
              isAutoCorrect={true}
              onChangeText={email => this.setState({ email })}
            />
            <MyInput
              value={this.state.password}
              style={{ paddingHorizontal: 15 }}
              isSecure={true}
              placeHolder='Password'
              isAutoCorrect={false}
              onChangeText={password => this.setState({ password })}
            />
            {this.renderSignButton()}
            <MyButton color='#008ee0'>
              Continue With Facebbok
            </MyButton>
          </View>
          <View style={[styles.switchMethodeOption, { bottom: this.state.isKeyboardOpened ? 30 : 0 }]}>
            <Text style={styles.switchMethodeText}>
              {this.state.screen === 'login' ? "Don't have an account?" : "Already a member?"}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                setTimeout(() => { this.setState({ email: '', password: '' }) }, 100)
                this.setState(({ screen }) => {
                  if (screen === 'login')
                    return { screen: 'signup' }
                  return { screen: 'login' }
                })
              }}
            >
              <Text style={styles.switchMethodeLink}>
                {this.state.screen === 'login' ? 'Sign up.' : 'Log in.'}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ height: 72, justifyContent: 'center' }}>
            {this.renderError()}
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 15
  },
  title: {
    marginBottom: 25,
    color: '#fff',
    fontSize: 44,
    alignSelf: 'center',
    fontFamily: 'PermanentMarker-Regular'
  },
  switchMethodeOption: {
    position: 'absolute',
    height: 50,
    width: Dimensions.get('window').width,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  switchMethodeText: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 4
  },
  switchMethodeLink: {
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
  userSignin: (email, password) => dispatch(userSignin(email, password)),
  userSignup: (email, password) => dispatch(userSignup(email, password))
})

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    loading: state.auth.loading
  }
}

export default connect(mapStateToProps, mapActionsToProps)(AuthScreen)