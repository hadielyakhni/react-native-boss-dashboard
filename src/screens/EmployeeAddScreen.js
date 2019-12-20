import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { addEmployee, updateOnScreenEmployeeInfo, resetEmployee } from '../actions'
import { Icon, Spinner } from 'native-base'
import Dialog, {
  FadeAnimation,
  DialogContent
} from 'react-native-popup-dialog'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'

class EmployeeAddScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Add An Employee',
    headerLeft: (
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon
          name='ios-arrow-back'
          style={styles.backIcon}
        />
      </TouchableOpacity>
    )
  })
  componentDidMount() {
    this.props.resetEmployee()
  }
  render() {
    const { name, phone, role, salary } = this.props
    return (
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
          value={name}
          isSecure={false}
          placeHolder='Name'
          isAutoCorrect={false}
          onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'name', value })}
        />
        <MyInput
          value={phone}
          isSecure={false}
          placeHolder='Phone'
          isAutoCorrect={false}
          onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'phone', value })}
        />
        <MyInput
          value={role}
          isSecure={false}
          placeHolder='Role'
          isAutoCorrect={false}
          onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'role', value })}
        />
        <MyInput
          value={salary}
          isSecure={false}
          placeHolder='Salary'
          isAutoCorrect={false}
          onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'salary', value })}
        />
        <MyButton
          style={{ marginBottom: 15 }}
          onPress={() => this.props.addEmployee({ name, phone, role, salary })}
        >Add</MyButton>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
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

const mapDispatchToProps = dispatch => ({
  updateOnScreenEmployeeInfo: ({ prop, value }) => dispatch(updateOnScreenEmployeeInfo({ prop, value })),
  addEmployee: ({ name, phone, role, salary }) => dispatch(addEmployee({ name, phone, role, salary })),
  resetEmployee: () => dispatch(resetEmployee())
})

const mapStateToProps = state => {
  const { name, phone, role, salary, addingEmployee } = state.employees
  return {
    name,
    phone,
    role,
    salary,
    addingEmployee
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeAddScreen)