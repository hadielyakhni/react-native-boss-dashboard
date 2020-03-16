import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Text,
  StyleSheet,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { Spinner } from 'native-base'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'
import { userSignup } from '../actions'

class SignupScreen extends Component {
  constructor() {
    super()
    this.keyboardDidShowListner = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListner = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    this.state = {
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
  onSignup = () => {
    const { email, password } = this.state
    this.props.userSignup(email, password)
  }
  renderSignupButton() {
    if (!this.props.loading)
      return (
        <MyButton
          style={{ marginTop: 15, marginBottom: 10, }}
          disabled={!this.state.email || !this.state.password}
          onPress={this.onSignup.bind(this)}
        >Sign Up</MyButton>
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
            {this.renderSignupButton()}
            <MyButton>
              Sign Up With Facebbok
            </MyButton>
          </View>
          <View style={[styles.loginOption, { bottom: this.state.isKeyboardOpened ? 30 : 0 }]}>
            <Text style={styles.loginText}>
              Already a member?
            </Text>
            <TouchableWithoutFeedback
              onPress={() => {
                setTimeout(() => { this.setState({ email: '', password: '' }) }, 100)
                Navigation.pop(this.props.componentId, {
                  animations: {
                    pop: {
                      enabled: false
                    }
                  }
                })
              }}
            >
              <Text style={styles.loginLink}>
                Log in.
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
  loginOption: {
    position: 'absolute',
    height: 50,
    width: Dimensions.get('window').width,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginText: {
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.6)',
    marginRight: 4
  },
  loginLink: {
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
  userSignup: (email, password) => dispatch(userSignup(email, password))
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