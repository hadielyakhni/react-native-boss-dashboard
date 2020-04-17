import React, { Component } from 'react'
import { Text, StyleSheet, View, ActivityIndicator, InteractionManager, Keyboard, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { addEmployee, resetEmployee } from '../actions'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MyInput from '../components/MyInput'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker'

class EmployeeAddScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    InteractionManager.runAfterInteractions(() => {
      this.separator = () => <View style={{ marginVertical: 2 }}></View>
      this.setState({
        canRender: true,
        name: '',
        role: '',
        salary: '',
        phone: '',
        email: '',
        showDatePicker: false,
        joinDate: '',
        isAddButtonDisabled: false
      })
    })
  }
  isAddDisabled() {
    const { name, role, salary } = this.state
    if (!name || !role || !salary || this.state.isAddButtonDisabled)
      return true
    return false
  }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  render() {
    return (
      this.state.canRender ?
        <View style={{
          ...styles.container,
          backgroundColor: this.useTheme('#f5f5f5', '#161616')
        }}>
          <View style={{ flex: 1 }}>
            <View style={{
              ...styles.header,
              backgroundColor: this.useTheme('#f5f5f5', '#161616')
            }}>
              <TouchableOpacity
                activeOpacity={0.8}
                hitSlop={{ bottom: 10, top: 10, left: 10, right: 10 }}
                style={{
                  ...styles.backIconContainer,
                  backgroundColor: this.useTheme('#f5f5f5', '#161616')
                }}
                onPress={() => Navigation.pop(this.props.componentId)}
              >
                <Ionicons name="md-arrow-back" size={26} color={this.useTheme('#303030', '#fbfbfb')} />
              </TouchableOpacity>
              <View style={{
                ...styles.titleContainer,
                backgroundColor: this.useTheme('#f5f5f5', '#161616')
              }}>
                <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 25, fontFamily: 'SourceSansPro-SemiBold' }}>
                  Add Empployee
              </Text>
              </View>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 5 }}>
              <MyInput
                theme={this.props.theme}
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
                theme={this.props.theme}
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
                theme={this.props.theme}
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
                theme={this.props.theme}
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
                theme={this.props.theme}
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
                theme={this.props.theme}
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
            <TouchableOpacity
              activeOpacity={0.92}
              disabled={this.isAddDisabled()}
              style={{
                elevation: this.isAddDisabled() ? 2 : 4,
                backgroundColor: this.useTheme('#f5f5f5', '#222'),
                height: 52,
                marginBottom: 24,
                alignSelf: 'flex-end',
                borderRadius: 26,
                alignItems: 'center',
                marginRight: 16,
                justifyContent: 'center'
              }}
              onPress={() => {
                this.setState({ isAddButtonDisabled: true })
                setTimeout(() => {
                  this.setState({ isAddButtonDisabled: false })
                }, 300);
                const { name, role, salary, phone, email, joinDate } = this.state
                this.props.addEmployee(this.props.componentId, { name, role, salary, phone, email, joinDate: joinDate || Date.now() })
              }}
            >
              {
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 16 }}>
                  <MaterialIcons name="done" color={this.isAddDisabled() ? this.useTheme('#afb8cb', '#777') : '#008ee0'} size={25} />
                  <Text style={{
                    marginLeft: 5,
                    fontFamily: 'SourceSansPro-SemiBold',
                    color: this.isAddDisabled() ? this.useTheme('#afb8cb', '#777') : '#008ee0',
                    fontSize: 16.5
                  }}>
                    Add
                </Text>
                </View>
              }
            </TouchableOpacity>
          </View>
        </View>
        :
        <View style={{ flex: 1, backgroundColor: this.useTheme('#f5f5f5', '#161616'), alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#008ee0" size={38} />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 10,
    paddingHorizontal: 4,
    marginVertical:
      Dimensions.get('window').width > 800 ? 20
        :
        Dimensions.get('window').width > 700 ? 12
          :
          Dimensions.get('window').width > 600 ? 8
            :
            Dimensions.get('window').width > 500 ? 6
              :
              2
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  backIconContainer: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const mapActionsToProps = dispatch => ({
  addEmployee: (componentId, { name, role, salary, phone, email, joinDate }) => dispatch(addEmployee(componentId, { name, role, salary, phone, email, joinDate })),
  resetEmployee: () => dispatch(resetEmployee())
})

export default connect(
  ({ app }) => ({ theme: app.theme }),
  mapActionsToProps
)(EmployeeAddScreen)