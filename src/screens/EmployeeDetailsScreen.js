import React, { Component } from 'react'
import { Text, StyleSheet, View, Linking, InteractionManager, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { updateEmployeeInfo, deleteEmployee } from '../actions'
import Dialog, {
  SlideAnimation,
  FadeAnimation,
  DialogContent,
  DialogFooter,
  DialogButton
} from 'react-native-popup-dialog'
import { Spinner } from 'native-base'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'

class EmployeeDetailsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false, dialogVisible: false }
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.separator = () => <View style={{ marginVertical: 2 }}></View>
        this.uid = this.props.uid
        const { data: { name, role, salary, phone, email } } = this.props
        this.setState({ canRender: true, name, role, salary, phone, email })
      })
    }, 400);
  }
  deletePressed = () => {
    this.setState({ dialogVisible: true })
  }
  render() {
    return (
      this.state.canRender ?
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
                    this.setState({ dialogVisible: false });
                    this.props.deleteEmployee(this.props.componentId, { uid: this.uid })
                  }}
                />
              </DialogFooter>
            }
            onTouchOutside={() => {
              this.setState({ dialogVisible: false });
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
                  This action can't be undo!
                          </Text>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                  Are You Sure?
                </Text>
              </View>
            </DialogContent>
          </Dialog>
          <Dialog
            useNativeDriver={true}
            rounded={true}
            dialogStyle={[styles.dialogStyle, { height: 145 }]}
            visible={this.props.deletingEmployee}
            dialogAnimation={new FadeAnimation({
              initialValue: 0,
              animationDuration: 150,
              useNativeDriver: true,
            })}
          >
            <DialogContent style={{ paddingTop: 30, alignItems: 'center', flex: 1, width: 200 }}>
              <Text style={{ color: '#fff', fontSize: 23, fontWeight: 'bold' }}>
                Deleting...
              </Text>
              <Spinner size={30} color='#008ee0' />
            </DialogContent>
          </Dialog>
          <Dialog
            useNativeDriver={true}
            rounded={true}
            dialogStyle={[styles.dialogStyle, { height: 145 }]}
            visible={this.props.updatingEmployee}
            dialogAnimation={new FadeAnimation({
              initialValue: 0,
              animationDuration: 150,
              useNativeDriver: true,
            })}
          >
            <DialogContent style={{ paddingTop: 30, alignItems: 'center', flex: 1, width: 200 }}>
              <Text style={{ color: '#fff', fontSize: 23, fontWeight: 'bold' }}>
                Updating...
              </Text>
              <Spinner size={30} color='#008ee0' />
            </DialogContent>
          </Dialog>
          <MyInput
            leftIcon='ios-person'
            value={this.state.name}
            style={{ fontSize: 16 }}
            isSecure={false}
            placeHolder='Name'
            isAutoCorrect={false}
            onChangeText={value => this.setState({ name: value })}
          />
          <MyInput
            value={this.state.role}
            leftIcon='ios-briefcase'
            style={{ fontSize: 16 }}
            isSecure={false}
            placeHolder='Role'
            isAutoCorrect={false}
            onChangeText={value => this.setState({ role: value })}
          />
          <MyInput
            value={this.state.salary}
            leftIcon='ios-cash'
            style={{ fontSize: 16 }}
            isSecure={false}
            placeHolder='Salary'
            isAutoCorrect={false}
            onChangeText={value => this.setState({ salary: value })}
          />
          <MyInput
            value={this.state.phone}
            leftIcon='ios-call'
            rightIcon='ios-arrow-forward'
            rightIconStyle={{ color: '#c5c5c5' }}
            onRightIconPress={() => Linking.openURL(`tel:${this.state.phone}`)}
            style={{ fontSize: 16 }}
            isSecure={false}
            placeHolder='Phone'
            isAutoCorrect={false}
            onChangeText={value => this.setState({ phone: value })}
          />
          <MyInput
            value={this.state.email}
            leftIcon='ios-mail'
            rightIcon='ios-arrow-forward'
            rightIconStyle={{ color: '#c5c5c5' }}
            onRightIconPress={() => { Linking.openURL(`mailto:${this.state.email}`) }}
            style={{ fontSize: 16 }}
            isSecure={false}
            placeHolder='Email'
            isAutoCorrect={false}
            onChangeText={value => this.setState({ email: value })}
          />
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <MyButton
              style={{ marginBottom: 10, height: 50 }}
              textStyle={{ fontSize: 20 }}
              onPress={() => {
                const { name, role, salary, phone, email } = this.state
                this.props.updateEmployeeInfo(this.props.componentId, { name, role, salary, phone, email, uid: this.uid })
              }}
            >Save</MyButton>
            <MyButton
              style={{ marginBottom: 20, height: 50, backgroundColor: '#E65100' }}
              textStyle={{ fontSize: 20 }}
              onPress={this.deletePressed}
            >Delete</MyButton>
          </View>
        </View>
        :
        <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#008ee0" size={38} />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingTop: 15
  },
  backButton: {
    marginRight: 15,
    alignItems: 'center',
    marginLeft: 5
  },
  backIcon: {
    fontSize: 29,
    color: '#fff',
  },
  dialogStyle: {
    height: 165,
    width: 265,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

const mapDispatchToProps = dispatch => ({
  updateEmployeeInfo: (componentId, { name, role, salary, phone, email, uid }) => dispatch(updateEmployeeInfo(componentId, { name, role, salary, phone, email, uid })),
  deleteEmployee: (componentId, { uid }) => dispatch(deleteEmployee(componentId, { uid }))
})

const mapStateToProps = state => ({
  updatingEmployee: state.employees.updatingEmployee,
  deletingEmployee: state.employees.deletingEmployee
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetailsScreen)