import React, { Component } from 'react'
import { Text, Modal, View, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { sendPasswordResetEmail, dsimissAuthError, hidePasswordResetSuccessModal } from '../actions'
import getAuthError from '../utils/getAuthError'

class ForgetPasswordScreen extends Component {
  state = { email: '' }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'flex-start'
      }}>
        <View style={{
          backgroundColor: '#000',
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 16
        }}>
          <TouchableOpacity style={{ width: 20 }} onPress={() => Navigation.pop(this.props.componentId)}>
            <Ionicons
              name="ios-arrow-back"
              color='#fff'
              size={25}
            />
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, color: '#fff', fontSize: 25, fontFamily: 'SourceSansPro-SemiBold' }}>Back</Text>
        </View>
        <View style={{
          backgroundColor: '#000',
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 52
        }}>
          <Text style={{ fontSize: 24, color: '#fff', fontFamily: 'SourceSansPro-Bold' }}>Forgot Password?</Text>
          <View style={{
            marginTop: 15,
            flexDirection: 'row',
            borderBottomColor: '#343434',
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingHorizontal: 6,
            marginBottom: 52
          }}>
            <MaterialCommunityIcons style={{ paddingBottom: 2 }} name="email" color="#fff" size={24} />
            <TextInput
              editable={!this.props.sendingPasswordResetEmail}
              keyboardType="email-address"
              ref={ref => this.inputRef = ref}
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              placeholder="Enter your Email"
              placeholderTextColor="#bbb"
              style={{
                alignSelf: 'center',
                flex: 1,
                color: '#fff',
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
              backgroundColor: '#212121',
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
                  color: !this.state.email.trim() ? '#aaa' : '#fff',
                  fontSize: 22,
                  fontFamily: 'SourceSansPro-SemiBold'
                }}>Sending...</Text>
                :
                <Text style={{
                  color: !this.state.email.trim() ? '#aaa' : '#fff',
                  fontSize: 22,
                  fontFamily: 'SourceSansPro-SemiBold'
                }}>
                  Send Email
                </Text>
            }
          </TouchableOpacity>
        </View>
        <View style={{ padding: 15, backgroundColor: '#000', paddingBottom: 40 }}>
          <Text style={{ color: '#d6af00', fontSize: 13, fontFamily: 'SourceSansPro-Regular' }}>
            Don't reset your password if you signed in with FACEBOOK.
            If you do, you will no longer be able to login with FACEBOOK,
            and you should login with your EMAIL ADDRESS and the new PASSWORD!
          </Text>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={!!this.props.error}>
          <View style={styles.errorModalContainer} >
            <View style={styles.errorModal}>
              <View style={styles.upperModalPart}>
                <Text style={{ color: '#eef', fontSize: 21, fontFamily: 'SourceSansPro-Bold' }}>Error</Text>
                <Text style={{
                  textAlign: 'center',
                  color: '#ccc',
                  fontSize: 14.5,
                  fontFamily: 'SourceSansPro-Regular',
                  marginTop: 12
                }}>{getAuthError(this.props.error, true)}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.78}
                style={styles.lowerModalPart}
                onPress={() => this.props.dsimissAuthError()}
              >
                <Text style={{ color: '#008ee0', fontSize: 17, fontFamily: 'SourceSansPro-Regular' }}>
                  Dismiss
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.showPasswordResetSuccess}
        >
          <View style={styles.errorModalContainer} >
            <View style={styles.errorModal}>
              <View style={styles.upperModalPart}>
                <Text style={{ color: '#eef', fontSize: 17, fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
                  Email was sent to
                </Text>
                <Text style={{ color: '#fff', fontSize: 17, fontWeight: 'bold' }}>
                  {this.state.email}
                </Text>
                <Text style={{
                  textAlign: 'center',
                  color: '#bbb',
                  fontSize: 13,
                  marginTop: 12
                }}>Please check your inbox..</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.78}
                style={styles.lowerModalPart}
                onPress={() => this.props.hidePasswordResetSuccessModal()}
              >
                <Text style={{ color: '#07a238', fontSize: 16 }}>OK</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorModal: {
    borderRadius: 6,
    backgroundColor: '#272727',
    width: 250,
    paddingTop: 7,
    justifyContent: 'center'
  },
  upperModalPart: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    paddingTop: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#363636'
  },
  lowerModalPart: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 2
  }
}

const mapStateToProps = ({ auth }) => ({
  error: auth.error,
  sendingPasswordResetEmail: auth.sendingPasswordResetEmail,
  showPasswordResetSuccess: auth.showPasswordResetSuccess
})

const mapDispatchToProps = dispatch => ({
  sendPasswordResetEmail: email => dispatch(sendPasswordResetEmail(email)),
  dsimissAuthError: () => dispatch(dsimissAuthError()),
  hidePasswordResetSuccessModal: () => dispatch(hidePasswordResetSuccessModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordScreen)