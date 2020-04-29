import React, { Component } from 'react'
import { Text, Modal, View, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Dimensions } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { sendPasswordResetEmail, dsimissAuthError, hidePasswordResetSuccessModal } from '../actions'
import getAuthError from '../utils/getAuthError'
import { translate, isRTL } from '../utils/i18n'

class ForgetPasswordScreen extends Component {
  state = { email: this.props.email || '' }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{
        flex: 1,
        backgroundColor: this.useTheme('#f5f5f5', '#161616'),
        justifyContent: 'flex-start',
        paddingVertical: 3,
        paddingHorizontal:
          Dimensions.get('window').width > 800 ? 30
            :
            Dimensions.get('window').width > 700 ? 25
              :
              Dimensions.get('window').width > 600 ? 15
                :
                Dimensions.get('window').width > 500 ? 10
                  :
                  7
      }}>
        <View style={{
          backgroundColor: this.useTheme('#f5f5f5', '#161616'),
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal:
            Dimensions.get('window').width > 800 ? 30
              :
              Dimensions.get('window').width > 700 ? 25
                :
                Dimensions.get('window').width > 600 ? 15
                  :
                  Dimensions.get('window').width > 500 ? 10
                    :
                    6
        }}>
          <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => Navigation.pop(this.props.componentId)}>
            <Ionicons name={isRTL() ? "ios-arrow-forward" : "ios-arrow-back"} color={this.useTheme('#303030', '#fbfbfb')} size={25} />
            <Text style={{
              marginHorizontal: 14, color: this.useTheme('#303030', '#fbfbfb'), fontSize: 25, fontFamily: 'SourceSansPro-SemiBold'
            }}>{translate('auth.forgetPassword.back')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{
          backgroundColor: this.useTheme('#f5f5f5', '#161616'),
          flex: 1,
          paddingTop: 52,
          paddingHorizontal:
            Dimensions.get('window').width > 800 ? 120
              :
              Dimensions.get('window').width > 700 ? 100
                :
                Dimensions.get('window').width > 600 ? 40
                  :
                  Dimensions.get('window').width > 500 ? 25
                    :
                    8
        }}>
          <Text style={{ fontSize: 24, color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-Bold' }}>
            {translate('auth.forgetPassword.forgotPassword')}
          </Text>
          <View style={{
            marginTop: 15,
            flexDirection: 'row',
            borderBottomColor: this.useTheme('#ccc', '#343434'),
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingHorizontal: 6,
            marginBottom: 52
          }}>
            <MaterialCommunityIcons style={{ paddingBottom: 2 }} name="email" color={this.useTheme('#303030', "#fbfbfb")} size={24} />
            <TextInput
              autoCapitalize="none"
              editable={!this.props.sendingPasswordResetEmail && !this.props.email}
              keyboardType="email-address"
              ref={ref => this.inputRef = ref}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              placeholder={translate('auth.forgetPassword.placeholder')}
              placeholderTextColor={this.useTheme('#999', 'rgba(255, 255, 255, 0.6)')}
              style={{
                textAlign: isRTL() ? 'right' : 'left',
                alignSelf: 'center',
                flex: 1,
                color: this.useTheme('#303030', '#fbfbfb'),
                fontSize: 18,
                paddingLeft: 12,
                fontFamily: 'SourceSansPro-Regular'
              }}
            />
          </View>
          <TouchableOpacity
            disabled={this.props.sendingPasswordResetEmail}
            activeOpacity={0.9}
            style={{
              height: 60,
              backgroundColor: this.useTheme('#f4f4f4', '#212121'),
              elevation: 2.4,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onPress={() => {
              if (!this.state.email)
                this.inputRef.focus()
              else
                this.props.sendPasswordResetEmail(this.state.email.trim())
            }}
          >
            {
              this.props.sendingPasswordResetEmail ?
                <Text style={{
                  color: this.useTheme(
                    !this.state.email.trim() ? '#888' : '#444',
                    !this.state.email.trim() ? '#aaa' : '#fbfbfb'
                  ),
                  fontSize: 22,
                  fontFamily: 'SourceSansPro-SemiBold'
                }}>{translate('auth.forgetPassword.sending')}</Text>
                :
                <Text style={{
                  color: this.useTheme(
                    !this.state.email.trim() ? '#888' : '#303030',
                    !this.state.email.trim() ? '#aaa' : '#fbfbfb'
                  ),
                  fontSize: 22,
                  fontFamily: 'SourceSansPro-SemiBold'
                }}>
                  {translate('auth.forgetPassword.sendEmail')}
                </Text>
            }
          </TouchableOpacity>
        </View>
        {
          !this.props.email ?
            <View style={{
              padding: 15,
              backgroundColor: this.useTheme('#f5f5f5', '#161616'),
              paddingBottom: 40,
              paddingHorizontal:
                Dimensions.get('window').width > 800 ? 120
                  :
                  Dimensions.get('window').width > 700 ? 100
                    :
                    Dimensions.get('window').width > 600 ? 40
                      :
                      Dimensions.get('window').width > 500 ? 25
                        :
                        8
            }}>
              <Text style={{ color: this.useTheme('#dd8913', '#d6af00'), fontSize: 13, fontFamily: 'SourceSansPro-Regular' }}>
                {translate('auth.forgetPassword.warning')}
              </Text>
            </View>
            :
            null
        }
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
        <Modal
          onRequestClose={this.props.hidePasswordResetSuccessModal}
          animationType="fade"
          transparent={true}
          visible={this.props.showPasswordResetSuccess}
        >
          <View style={styles.errorModalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.props.hidePasswordResetSuccessModal}
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
                <Text style={{ color: this.useTheme('#303030', '#eef'), fontSize: 17, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
                  {translate('components.successModal.message1')}
                </Text>
                <Text style={{ textAlign: 'center', color: this.useTheme('#303030', '#fbfbfb'), fontSize: 17, fontWeight: 'bold' }}>
                  {this.state.email}
                </Text>
                <Text style={{
                  textAlign: 'center',
                  color: this.useTheme('#494949', '#bbb'),
                  fontSize: 13,
                  marginTop: 12
                }}>{translate('components.successModal.message2')}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.78}
                style={styles.lowerModalPart}
                onPress={this.props.hidePasswordResetSuccessModal}
              >
                <Text style={{ color: '#07a238', fontSize: 16 }}>
                  {translate('components.successModal.ok')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal >
      </KeyboardAvoidingView >
    )
  }
}

const styles = {
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
  }
}

const mapStateToProps = ({ auth, app }) => ({
  error: auth.error,
  sendingPasswordResetEmail: auth.sendingPasswordResetEmail,
  showPasswordResetSuccess: auth.showPasswordResetSuccess,
  theme: app.theme
})

const mapDispatchToProps = dispatch => ({
  sendPasswordResetEmail: email => dispatch(sendPasswordResetEmail(email)),
  dsimissAuthError: () => dispatch(dsimissAuthError()),
  hidePasswordResetSuccessModal: () => dispatch(hidePasswordResetSuccessModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordScreen)