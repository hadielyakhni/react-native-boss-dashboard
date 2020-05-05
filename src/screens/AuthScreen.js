import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Text,
  StyleSheet,
  View,
  Keyboard,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  TextInput
} from 'react-native'
import { translate, isRTL } from '../utils/i18n'
import MyButton from '../components/MyButton'
import { userSignin, userSignup, userAuthenticateWithFacebook, userAuthenticateWithGoogle, dsimissAuthError } from '../actions'
import getAuthError from '../utils/getAuthError'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Icon } from 'native-base'
import { Navigation } from 'react-native-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SplashScreen from 'react-native-splash-screen'
import SpinKit from 'react-native-spinkit'

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

class AuthScreen extends Component {
  constructor(props) {
    super(props)
    if (!this.props.isFromWalkThroughScreen)
      setTimeout(() => {
        SplashScreen.hide()
      }, 100);
    this.keyboardDidShowListner = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListner = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    this.state = {
      screen: 'login',
      email: '',
      password: '',
      isPasswordSecure: true,
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
    Keyboard.dismiss()
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
        >
          {this.state.screen === 'login' ? translate('auth.auth.login') : translate('auth.auth.signup')}
        </MyButton>
      )
    return (
      <View style={styles.loadingContainer}>
        <SpinKit type="ThreeBounce" size={25} color="#f9f9f9" />
      </View>
    )
  }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  renderGoogleBtnContent() {
    if (!this.props.googleButtonDisabled)
      return (
        <>
          <FontAwesome size={22} name="google" color={this.props.loading || this.props.facebookButtonDisabled ? '#e3e3e3' : '#f9f9f9'} />
          {""}   {translate('auth.auth.googleBtnText')}
        </>
      )
    return <SpinKit type="ThreeBounce" size={25} color="#f9f9f9" />
  }
  renderFacebookBtnContent() {
    if (!this.props.facebookButtonDisabled)
      return (
        <>
          <FontAwesome size={22} name="facebook" color={this.props.loading || this.props.googleButtonDisabled ? '#e3e3e3' : '#f9f9f9'} />
          {""}   {translate('auth.auth.facebookBtnText')}
        </>
      )
    return <SpinKit type="ThreeBounce" size={25} color="#f9f9f9" />
  }
  render() {
    return (
      <KeyboardAvoidingView
        behavior='padding'
        style={{
          ...styles.container,
          backgroundColor: this.useTheme('#f5f5f5', '#161616')
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingBottom: !this.state.isKeyboardOpened ? Dimensions.get('window').height / 27 : 100,
            paddingHorizontal:
              Dimensions.get('window').width > 800 ? 160
                :
                Dimensions.get('window').width > 700 ? 125
                  :
                  Dimensions.get('window').width > 600 ? 70
                    :
                    Dimensions.get('window').width > 500 ? 50
                      :
                      0
          }}
        >
          {
            this.state.isKeyboardOpened ?
              <Text style={{ fontSize: 26, color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-SemiBold', marginVertical: 12, alignSelf: 'center' }}>
                B.D
              </Text>
              :
              <Text numberOfLines={1} style={{ ...styles.title, color: this.useTheme('#303030', '#fbfbfb') }}>
                Boss Dashboard
              </Text>
          }
          <View style={{ paddingHorizontal: 33 }}>
            <View style={[styles.inputContainer, {
              backgroundColor: this.useTheme('#f9f9f9', '#444'),
              borderWidth: this.useTheme(0.8, 0),
              borderColor: '#d8d8d8'
            }
            ]}>
              <Icon
                name="ios-mail"
                style={{
                  paddingLeft: 17,
                  paddingRight: 13,
                  fontSize: 24,
                  color: '#008ee0'
                }}
              />
              <TextInput
                keyboardType="email-address"
                ref={ref => this.emailInputRef = ref}
                autoCompleteType="email"
                returnKeyType="next"
                onSubmitEditing={() => this.passworfInputRef.focus()}
                blurOnSubmit={false}
                value={this.state.email}
                style={{
                  ...styles.InputStyle,
                  color: this.useTheme('#303030', '#fbfbfb'),
                  paddingRight: 15,
                  textAlign: isRTL() ? 'right' : 'left'
                }}
                placeholder={translate('auth.auth.email')}
                placeholderTextColor={this.useTheme('#999', 'rgba(255, 255, 255, 0.6)')}
                onChangeText={email => this.setState({ email })}
              />
            </View>
            <View style={[styles.inputContainer, {
              backgroundColor: this.useTheme('#f9f9f9', '#444'),
              borderWidth: this.useTheme(0.8, 0),
              borderColor: '#d8d8d8'
            }
            ]}>
              <Icon
                name="ios-lock"
                style={{
                  paddingLeft: 17,
                  paddingRight: 13,
                  fontSize: 24,
                  color: '#008ee0'
                }}
              />
              <TextInput
                ref={ref => this.passworfInputRef = ref}
                value={this.state.password}
                secureTextEntry={this.state.isPasswordSecure}
                returnKeyType="done"
                onSubmitEditing={() => {
                  this.state.email && this.state.password ? this.onSign.bind(this)() : null
                }}
                style={{
                  ...styles.InputStyle,
                  color: this.useTheme('#303030', '#fbfbfb'),
                  paddingRight: 15,
                  textAlign: isRTL() ? 'right' : 'left'
                }}
                placeholder={translate('auth.auth.password')}
                placeholderTextColor={this.useTheme('#999', 'rgba(255, 255, 255, 0.6)')}
                autoCapitalize='none'
                onChangeText={password => this.setState({ password })}
              />
              {
                this.state.password ?
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.rightIconContainer}
                    onPress={() => {
                      this.setState(state => ({ isPasswordSecure: !state.isPasswordSecure }))
                    }}
                  >
                    <MaterialIcons
                      name={this.state.isPasswordSecure ? "visibility-off" : "visibility"}
                      style={{ paddingHorizontal: 10 }}
                      size={21.5}
                      color={this.state.isPasswordSecure ? this.useTheme('#777', "#bbb") : "#008ee0"}
                    />
                  </TouchableOpacity>
                  :
                  null
              }
            </View>
            {this.renderSignButton()}
            <View style={{ flexDirection: 'row', marginBottom: 16, marginTop: 6, alignItems: 'center' }}>
              <View style={{ height: 0, flex: 1, borderColor: this.useTheme('#303030', '#fbfbfb'), borderWidth: 0.3 }}></View>
              <TouchableOpacity
                hitSlop={{ right: 20, left: 20, top: 10, bottom: 10 }}
                activeOpacity={1}
                onPress={() => {
                  if (this.state.screen === 'login')
                    Navigation.push(this.props.componentId, { component: { name: 'forgetPassword' } })
                }}
              >
                <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 13, fontFamily: 'SourceSansPro-SemiBold', marginHorizontal: 12 }}>
                  {this.state.screen === 'login' ? translate('auth.auth.forgotPassword') : translate('auth.auth.or')}
                </Text>
              </TouchableOpacity>
              <View style={{ height: 0, flex: 1, borderColor: this.useTheme('#303030', '#fbfbfb'), borderWidth: 0.3 }}></View>
            </View>
            <View>
              <MyButton
                disabledColor='#9e4242'
                disabled={this.props.googleButtonDisabled || this.props.facebookButtonDisabled || this.props.loading}
                onPress={() => {
                  Keyboard.dismiss()
                  this.props.userAuthenticateWithGoogle()
                }}
                color='#E53935'
              >
                {this.renderGoogleBtnContent()}
              </MyButton>
              <MyButton
                disabledColor='#355973'
                disabled={this.props.facebookButtonDisabled || this.props.googleButtonDisabled || this.props.loading}
                onPress={() => {
                  Keyboard.dismiss()
                  this.props.userAuthenticateWithFacebook()
                }}
                color='#008ee0'
              >
                {this.renderFacebookBtnContent()}
              </MyButton>
            </View>
          </View>
          <View style={[styles.switchMethodeOption, {
            bottom: this.state.isKeyboardOpened ? 30 : 0,
            borderTopColor: this.useTheme('rgba(0, 0, 0, 0.2)', 'rgba(255, 255, 255, 0.2)')
          }]}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                LayoutAnimation.configureNext({
                  update: {
                    duration: 100,
                    type: LayoutAnimation.Types.linear,
                    property: LayoutAnimation.Properties.opacity
                  }
                })
                this.setState(({ screen }) => {
                  if (screen === 'login')
                    return { screen: 'signup' }
                  return { screen: 'login' }
                })
              }}
              style={{ flexDirection: 'row', alignItems: 'center', flex: 1, height: 50, justifyContent: 'center' }}
            >
              <Text style={{
                ...styles.switchMethodeText,
                color: this.useTheme('rgba(0, 0, 0, 0.6)', 'rgba(255, 255, 255, 0.6)')
              }}>
                {this.state.screen === 'login' ?
                  translate('auth.auth.dontHaveAccount') :
                  translate('auth.auth.alreadyMember')}
              </Text>
              <Text style={{
                ...styles.switchMethodeLink,
                color: this.useTheme('#303030', '#fbfbfb')
              }}>
                {this.state.screen === 'login' ?
                  translate('auth.auth.signup') + '.' :
                  translate('auth.auth.login') + '.'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          onRequestClose={this.props.dsimissAuthError}
          animationType="fade"
          transparent={true}
          visible={!!this.props.error}
        >
          <View style={styles.errorModalContainer} >
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.props.dsimissAuthError}
              style={[StyleSheet.absoluteFill, {
                backgroundColor: this.props.theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)',
                zIndex: 0
              }]}></TouchableOpacity>
            <View style={{
              ...styles.errorModal,
              backgroundColor: this.useTheme('#fbfbfb', '#303030')
            }}>
              <View style={{
                ...styles.upperModalPart,
                borderBottomColor: this.useTheme('#eaeaea', '#363636')
              }}>
                <Text style={{ color: this.useTheme('#303030', '#eef'), fontSize: 21, fontFamily: 'SourceSansPro-Bold' }}>
                  {translate('components.errorModal.error')}
                </Text>
                <Text style={{
                  textAlign: 'center',
                  color: this.useTheme('#444', '#bbb'),
                  fontSize: 14.5,
                  fontFamily: 'SourceSansPro-Regular',
                  marginTop: 12
                }}>
                  {translate('components.errorModal.' + getAuthError(this.props.error))}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.78}
                style={styles.lowerModalPart}
                onPress={this.props.dsimissAuthError}
              >
                <Text style={{ color: '#008ee0', fontSize: 17, fontFamily: 'SourceSansPro-Regular' }}>
                  {translate('components.errorModal.dismiss')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // paddingTop: 66
  },
  title: {
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 44,
    alignSelf: 'center',
    fontFamily: 'SourceSansPro-SemiBold'
  },
  switchMethodeOption: {
    position: 'absolute',
    height: 50,
    width: Dimensions.get('window').width,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  switchMethodeText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13.5,
    marginRight: 4
  },
  switchMethodeLink: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14
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
  errorModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorModal: {
    borderRadius: 6,
    width: 250,
    paddingTop: 7,
    justifyContent: 'center'
  },
  upperModalPart: {
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderBottomWidth: 1
  },
  lowerModalPart: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 2
  },
  inputContainer: {
    borderRadius: 5,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  InputStyle: {
    flex: 1,
    height: 45,
    borderRadius: 5,
    fontSize: 16.5,
    fontFamily: 'SourceSansPro-Regular'
  },
  rightIconContainer: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapActionsToProps = dispatch => ({
  userSignin: (email, password) => dispatch(userSignin(email, password)),
  userSignup: (email, password) => dispatch(userSignup(email, password)),
  userAuthenticateWithFacebook: () => dispatch(userAuthenticateWithFacebook()),
  userAuthenticateWithGoogle: () => dispatch(userAuthenticateWithGoogle()),
  dsimissAuthError: () => dispatch(dsimissAuthError())
})

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    loading: state.auth.loading,
    facebookButtonDisabled: state.auth.facebookButtonDisabled,
    googleButtonDisabled: state.auth.googleButtonDisabled,
    theme: state.app.theme
  }
}

export default connect(mapStateToProps, mapActionsToProps)(AuthScreen)