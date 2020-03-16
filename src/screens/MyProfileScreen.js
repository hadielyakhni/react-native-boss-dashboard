import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, AsyncStorage } from 'react-native'
import { goToAuth } from '../navigation/navigation'
import { connect } from 'react-redux'
import Dialog, {
  SlideAnimation,
  FadeAnimation,
  DialogContent,
  DialogFooter,
  DialogButton
} from 'react-native-popup-dialog'
import { Spinner } from 'native-base'

class MyProfileScreen extends Component {
  state = {
    dialogVisible: false,
    loggingout: false
  }
  render() {
    return (
      <View style={styles.container}>
        <Dialog
          useNativeDriver={true}
          rounded={true}
          dialogStyle={styles.dialogStyle}
          visible={this.state.dialogVisible}
          dialogAnimation={new SlideAnimation({
            initialValue: 0,
            slideFrom: 'bottom',
            useNativeDriver: true,
          })}
          footer={
            <DialogFooter bordered={false}>
              <DialogButton
                textStyle={{ color: '#008ee0', fontSize: 18, fontWeight: 'bold' }}
                text="CANCEL"
                onPress={() => this.setState({ dialogVisible: false })}
              />
              <DialogButton
                textStyle={{ color: '#008ee0', fontSize: 18, fontWeight: 'bold' }}
                text="YES"
                onPress={() => {
                  this.setState({ dialogVisible: false, loggingout: true })
                  setTimeout(() => {
                    AsyncStorage.clear()
                    this.props.resetTasks()
                    this.props.resetEmployees()
                    this.props.resetAccounts()
                    this.setState({ loggingout: false })
                    goToAuth('fromMain')
                  }, 100);
                }}
              />
            </DialogFooter>
          }
          onTouchOutside={() => {
            this.setState({ dialogVisible: false })
          }}
          onHardwareBackPress={() => {
            this.setState({ dialogVisible: false })
          }}
        >
          <DialogContent>
            <View style={{
              height: 75,
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                Are you sure you want to logout?
              </Text>
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                Please confirm
              </Text>
            </View>
          </DialogContent>
        </Dialog>
        <Dialog
          useNativeDriver={true}
          rounded={true}
          dialogStyle={[styles.dialogStyle, { height: 145 }]}
          visible={this.state.loggingout}
          dialogAnimation={new FadeAnimation({
            initialValue: 0,
            animationDuration: 150,
            useNativeDriver: true,
          })}
        >
          <DialogContent style={{ paddingTop: 30, alignItems: 'center', flex: 1, width: 200 }}>
            <Text style={{ color: '#fff', fontSize: 23, fontWeight: 'bold' }}>
              Logging Out...
            </Text>
            <Spinner size={30} color='#008ee0' />
          </DialogContent>
        </Dialog>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            this.setState({ dialogVisible: true })
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
  },
  dialogStyle: {
    height: 165,
    width: 265,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

const mapDiaptchToProps = dispatch => ({
  resetTasks: () => dispatch({ type: 'logout_tasks_reset' }),
  resetEmployees: () => dispatch({ type: 'logout_employees_reset' }),
  resetAccounts: () => dispatch({ type: 'logout_accounts_reset' }),
})

export default connect(null, mapDiaptchToProps)(MyProfileScreen)