import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Modal } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from '@react-native-community/google-signin'
import AsyncStorage from '@react-native-community/async-storage'
import { goToAuth } from '../navigation/navigation'
import { connect } from 'react-redux'
import { Spinner } from 'native-base'

class MyProfileScreen extends Component {
  state = {
    modalVisible: false,
    loggingout: false
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={[StyleSheet.absoluteFill, {
          backgroundColor: this.state.modalVisible ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,1)',
          zIndex: this.state.modalVisible ? 1 : 0
        }]}>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}>
          <View
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <View style={styles.modal}>
              <View style={styles.upperModal}>
                <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>
                  Log out of Boss Dasboard?
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: false, loggingout: true })
                  LoginManager.logOut()
                  GoogleSignin.signOut()
                  AsyncStorage.clear()
                  this.props.resetTasks()
                  this.props.resetEmployees()
                  this.props.resetAccounts()
                  setTimeout(() => {
                    goToAuth()
                  }, 600);
                }}
                activeOpacity={0.6}
                style={styles.centerModal}
              >
                <Text style={{ color: '#de3b5b', fontSize: 18, fontFamily: 'SourceSansPro-SemiBold' }}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ modalVisible: false })}
                activeOpacity={0.6}
                style={styles.lowerModal}
              >
                <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.loggingout}>
          <View style={styles.loadingModalContainer} >
            <View style={styles.loadingModal}>
              <Spinner color='#cccccc' size={26} style={{ marginRight: 15 }} />
              <Text style={{ color: '#eeeeee', fontSize: 17, fontFamily: 'SourceSansPro-Regular' }}>
                logging out...
              </Text>
            </View>
          </View>
        </Modal>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
              Settings
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            this.setState({ modalVisible: true })
          }}
        >
          <Text style={styles.logoutText}>
            LOGOUT
          </Text>
        </TouchableOpacity>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15
  },
  header: {
    paddingTop: 8,
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#000'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  logoutButton: {
    backgroundColor: '#de3b5b',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutText: {
    color: '#fff',
    fontSize: 19,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  modal: {
    backgroundColor: '#171717',
    height: 168,
    alignSelf: 'center',
    borderRadius: 4
  },
  upperModal: {
    height: 70,
    backgroundColor: '#171717',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  centerModal: {
    height: 49,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.6,
    borderBottomColor: '#282828',
    borderTopWidth: 0.6,
    borderTopColor: '#282828'
  },
  lowerModal: {
    height: 49,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4
  },
  loadingModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingModal: {
    borderRadius: 6,
    backgroundColor: '#171717',
    width: 170,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  }
})

const mapStateToProps = ({ auth }) => ({
  user: auth.user
})

const mapDiaptchToProps = dispatch => ({
  resetTasks: () => dispatch({ type: 'logout_tasks_reset' }),
  resetEmployees: () => dispatch({ type: 'logout_employees_reset' }),
  resetAccounts: () => dispatch({ type: 'logout_accounts_reset' }),
})

export default connect(mapStateToProps, mapDiaptchToProps)(MyProfileScreen)