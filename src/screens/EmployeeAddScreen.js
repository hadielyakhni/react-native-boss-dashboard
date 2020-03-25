import React, { Component } from 'react'
import { Text, StyleSheet, View, ActivityIndicator, InteractionManager, Modal, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import { addEmployee, resetEmployee } from '../actions'
import { Spinner } from 'native-base'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'

class EmployeeAddScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    InteractionManager.runAfterInteractions(() => {
      this.separator = () => <View style={{ marginVertical: 2 }}></View>
      this.setState({ canRender: true, name: '', role: '', salary: '', phone: '', email: '' })
    })
  }
  isAddDisabled() {
    const { name, role, salary, phone } = this.state
    if (!name || !role || !salary || !phone)
      return true
    return false
  }
  render() {
    return (
      this.state.canRender ?
        <View style={styles.container}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.addingEmployee}>
            <View style={[styles.loadingModalContainer]} >
              <View style={styles.loadingModal}>
                <Spinner color='#eeeeee' size={27} style={{ marginRight: 0 }} />
                <Text style={{ color: '#eeeeee', fontSize: 15 }}>Adding...</Text>
              </View>
            </View>
          </Modal>
          <View style={{ flex: 1 }}>
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
              keyboardType="decimal-pad"
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
              keyboardType="number-pad"
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
              keyboardType="email-address"
              value={this.state.email}
              leftIcon='ios-mail'
              style={{ fontSize: 16 }}
              isSecure={false}
              placeHolder='Email'
              isAutoCorrect={false}
              onChangeText={value => this.setState({ email: value })}
            />
            <Text style={{ marginTop: 10, fontSize: 12, fontWeight: 'bold', fontStyle: 'italic', color: '#bbb' }}>
              Email is not required! **
            </Text>
          </View>
          <View style={{ height: 125, justifyContent: 'center' }}>
            <MyButton
              style={{ marginBottom: 15, height: 50, borderRadius: 10, height: 56 }}
              disabled={this.isAddDisabled()}
              disabledColor='#355973'
              color='#008ee0'
              textStyle={{ fontSize: 18 }}
              onPress={() => {
                const { name, role, salary, phone, email } = this.state
                this.props.addEmployee(this.props.componentId, { name, role, salary, phone, email })
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
  loadingModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingModal: {
    borderRadius: 6,
    backgroundColor: '#171717',
    width: 140,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  }
})

const mapStateToProps = state => ({
  addingEmployee: state.employees.addingEmployee
})

const mapActionsToProps = dispatch => ({
  addEmployee: (componentId, { name, role, salary, phone, email }) => dispatch(addEmployee(componentId, { name, role, salary, phone, email })),
  resetEmployee: () => dispatch(resetEmployee())
})

export default connect(mapStateToProps, mapActionsToProps)(EmployeeAddScreen)