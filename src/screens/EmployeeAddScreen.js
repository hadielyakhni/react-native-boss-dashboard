import React, { Component } from 'react'
import { Text, StyleSheet, View, ActivityIndicator, InteractionManager } from 'react-native'
import { connect } from 'react-redux'
import { addEmployee, updateOnScreenEmployeeInfo, resetEmployee } from '../actions'
import { Spinner, Icon } from 'native-base'
import Dialog, {
  FadeAnimation,
  DialogContent
} from 'react-native-popup-dialog'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'

class EmployeeAddScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    InteractionManager.runAfterInteractions(() => {
      this.separator = () => <View style={{ marginVertical: 2 }}></View>
      this.props.resetEmployee()
      this.setState({
        canRender: true,
        name: '',
        role: '',
        salary: '',
        phone: '',
        email: ''
      })
    })
  }
  render() {
    return (
      this.state.canRender ?
        <View style={styles.container}>
          <Dialog
            useNativeDriver={true}
            rounded={true}
            dialogStyle={[styles.dialogStyle, { height: 145 }]}
            visible={this.props.addingEmployee}
            dialogAnimation={new FadeAnimation({
              initialValue: 0,
              animationDuration: 150,
              useNativeDriver: true,
            })}
          >
            <DialogContent style={{ paddingTop: 30, alignItems: 'center', flex: 1, width: 200 }}>
              <Text style={{ color: '#fff', fontSize: 23, fontWeight: 'bold' }}>
                Adding...
              </Text>
              <Spinner size={30} color='#008ee0' />
            </DialogContent>
          </Dialog>
          <MyInput
            value={this.state.name}
            leftIcon='ios-person'
            style={{ fontSize: 16 }}
            isSecure={false}
            placeHolder='Name'
            isAutoCorrect={false}
            onChangeText={value => this.setState({ name: value })}
          />
          <this.separator />
          <MyInput
            value={this.state.role}
            leftIcon='ios-briefcase'
            style={{ fontSize: 16 }}
            isSecure={false}
            placeHolder='Role'
            isAutoCorrect={false}
            onChangeText={value => this.setState({ role: value })}
          />
          <this.separator />
          <MyInput
            value={this.state.salary}
            leftIcon='ios-cash'
            style={{ fontSize: 16 }}
            isSecure={false}
            placeHolder='Salary'
            isAutoCorrect={false}
            onChangeText={value => this.setState({ salary: value })}
          />
          <this.separator />
          <MyInput
            value={this.state.phone}
            leftIcon='ios-call'
            style={{ fontSize: 16 }}
            isSecure={false}
            placeHolder='Phone'
            isAutoCorrect={false}
            onChangeText={value => this.setState({ phone: value })}
          />
          <this.separator />
          <MyInput
            value={this.state.email}
            leftIcon='ios-mail'
            style={{ fontSize: 16 }}
            isSecure={false}
            placeHolder='Email'
            isAutoCorrect={false}
            onChangeText={value => this.setState({ email: value })}
          />
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <MyButton
              style={{ marginBottom: 15, height: 50 }}
              textStyle={{ fontSize: 20 }}
              onPress={() => {
                const { name, role, salary, phone, email } = this.state
                this.props.addEmployee({ name, role, salary, phone, email })
              }}
            >Add</MyButton>
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
    height: 175,
    width: 265,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

const mapStateToProps = state => ({
  addingEmployee: state.employees.addingEmployee
})

const mapActionsToProps = dispatch => ({
  addEmployee: ({ name, role, salary, phone, email }) => dispatch(addEmployee({ name, role, salary, phone, email })),
  resetEmployee: () => dispatch(resetEmployee())
})

export default connect(mapStateToProps, mapActionsToProps)(EmployeeAddScreen)