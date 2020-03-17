import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Modal } from 'react-native'
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}>
          <View
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'center' }}
          >
            <View style={styles.modal}>
              <View style={styles.upperModal}>
                <Text style={{ color: '#fff', fontSize: 15 }}>Log out of The Boss?</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: false, loggingout: true })
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
                <Text style={{ color: '#008ee0', fontSize: 18, fontWeight: 'bold' }}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ modalVisible: false })}
                activeOpacity={0.6}
                style={styles.lowerModal}
              >
                <Text style={{ color: '#fff' }}>Cancel</Text>
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
              <Text style={{ color: '#cccccc', fontSize: 16 }}>logging out...</Text>
            </View>
          </View>
        </Modal>
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
  },
  modal: {
    backgroundColor: '#171717',
    width: 250,
    height: 175,
    alignSelf: 'center',
    borderRadius: 4
  },
  upperModal: {
    height: 75,
    backgroundColor: '#171717',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerModal: {
    height: 50,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.6,
    borderBottomColor: '#282828',
    borderTopWidth: 0.6,
    borderTopColor: '#282828'
  },
  lowerModal: {
    height: 50,
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

const mapDiaptchToProps = dispatch => ({
  resetTasks: () => dispatch({ type: 'logout_tasks_reset' }),
  resetEmployees: () => dispatch({ type: 'logout_employees_reset' }),
  resetAccounts: () => dispatch({ type: 'logout_accounts_reset' }),
})

export default connect(null, mapDiaptchToProps)(MyProfileScreen)



