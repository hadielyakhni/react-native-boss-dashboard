import React, { Component } from 'react'
import { Text, StyleSheet, View, ActivityIndicator, InteractionManager, Keyboard, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { addEmployee, resetEmployee } from '../actions'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'
import DateTimePicker from '@react-native-community/datetimepicker'

class EmployeeAddScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    InteractionManager.runAfterInteractions(() => {
      this.separator = () => <View style={{ marginVertical: 2 }}></View>
      this.setState({ canRender: true, name: '', role: '', salary: '', phone: '', email: '', showDatePicker: false, joinDate: '' })
    })
  }
  isAddDisabled() {
    const { name, role, salary } = this.state
    if (!name || !role || !salary)
      return true
    return false
  }
  render() {
    return (
      this.state.canRender ?
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{ bottom: 10, top: 10, left: 10, right: 10 }}
                style={styles.backIconContainer}
                onPress={() => Navigation.pop(this.props.componentId)}
              >
                <Ionicons name="md-arrow-back" size={26} color="#fff" />
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text numberOfLines={1} style={{ color: '#fff', fontSize: 25, fontFamily: 'SourceSansPro-SemiBold' }}>
                  Add Empployee
              </Text>
              </View>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 5 }}>
              <MyInput
                value={this.state.name}
                leftIcon='ios-person'
                inputContainerStyle={{ marginTop: 10, marginBottom: 8 }}
                style={{ fontSize: 17, paddingRight: 15 }}
                isSecure={false}
                placeHolder='Name'
                autoCapitalize="words"
                isAutoCorrect={false}
                onChangeText={value => this.setState({ name: value })}
              />
              <this.separator />
              <MyInput
                autoCapitalize="words"
                inputContainerStyle={{ marginVertical: 8 }}
                value={this.state.role}
                leftIcon='ios-briefcase'
                style={{ fontSize: 17, paddingRight: 15 }}
                isSecure={false}
                placeHolder='Role'
                isAutoCorrect={false}
                onChangeText={value => this.setState({ role: value })}
              />
              <this.separator />
              <MyInput
                keyboardType="decimal-pad"
                value={this.state.salary}
                inputContainerStyle={{ marginVertical: 8 }}
                leftIcon='ios-cash'
                style={{ fontSize: 17, paddingRight: 15 }}
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
                inputContainerStyle={{ marginVertical: 8 }}
                style={{ fontSize: 16, paddingRight: 15 }}
                isSecure={false}
                placeHolder='Phone (optional)'
                isAutoCorrect={false}
                onChangeText={value => this.setState({ phone: value })}
              />
              <this.separator />
              <MyInput
                keyboardType="email-address"
                value={this.state.email}
                leftIcon='ios-mail'
                inputContainerStyle={{ marginVertical: 8 }}
                style={{ fontSize: 16, paddingRight: 15 }}
                isSecure={false}
                placeHolder='Email (optional)'
                isAutoCorrect={false}
                onChangeText={value => this.setState({ email: value })}
              />
              <MyInput
                onTouchStart={() => {
                  Keyboard.dismiss()
                  this.setState({ showDatePicker: true })
                }}
                editable={false}
                placeHolder={'Joined since :  ' + ("0" + new Date(Date.now()).getDate()).slice(-2) + "-" + ("0" + (new Date(Date.now()).getMonth() + 1)).slice(-2) + "-" + new Date(Date.now()).getFullYear() + " - Today"}
                value={
                  this.state.joinDate ?
                    'Joined since :  ' + ("0" + new Date(this.state.joinDate).getDate()).slice(-2) + "-" + ("0" + (new Date(this.state.joinDate).getMonth() + 1)).slice(-2) + "-" + new Date(this.state.joinDate).getFullYear()
                    :
                    this.state.joinDate
                }
                leftIcon='md-calendar'
                inputContainerStyle={{ marginVertical: 8 }}
                style={{ fontSize: 16, paddingRight: 15 }}
              />
              {
                this.state.showDatePicker
                &&
                <DateTimePicker
                  timeZoneOffsetInMinutes={0}
                  value={this.state.joinDate || Date.now()}
                  mode={"date"}
                  is24Hour={true}
                  display="default"
                  minimumDate={315529260000}
                  onChange={date => {
                    this.setState(() => {
                      if (date.type === "dismissed")
                        return { showDatePicker: false }
                      return {
                        showDatePicker: false,
                        joinDate: date.nativeEvent.timestamp
                      }
                    })
                  }}
                />
              }
            </View>
            <View style={{ height: 125, justifyContent: 'center', marginHorizontal: 12 }}>
              <MyButton
                style={{ marginBottom: 0, marginHorizontal: 0, borderRadius: 10, height: 56 }}
                disabled={this.isAddDisabled()}
                disabledColor='#355973'
                color='#008ee0'
                textStyle={{ fontSize: 19 }}
                onPress={() => {
                  const { name, role, salary, phone, email, joinDate } = this.state
                  this.props.addEmployee(this.props.componentId, { name, role, salary, phone, email, joinDate: joinDate || Date.now() })
                }}
              >Add</MyButton>
            </View>
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
    paddingHorizontal:
      Dimensions.get('window').width > 800 ? 62
        :
        Dimensions.get('window').width > 700 ? 48
          :
          Dimensions.get('window').width > 600 ? 36
            :
            Dimensions.get('window').width > 500 ? 10
              :
              0
  },
  header: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#000',
    marginVertical:
      Dimensions.get('window').width > 800 ? 20
        :
        Dimensions.get('window').width > 700 ? 12
          :
          Dimensions.get('window').width > 600 ? 8
            :
            Dimensions.get('window').width > 500 ? 6
              :
              0,
    marginBottom: 10,
    paddingHorizontal: 4
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  backIconContainer: {
    width: 42,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
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

const mapActionsToProps = dispatch => ({
  addEmployee: (componentId, { name, role, salary, phone, email, joinDate }) => dispatch(addEmployee(componentId, { name, role, salary, phone, email, joinDate })),
  resetEmployee: () => dispatch(resetEmployee())
})

export default connect(null, mapActionsToProps)(EmployeeAddScreen)