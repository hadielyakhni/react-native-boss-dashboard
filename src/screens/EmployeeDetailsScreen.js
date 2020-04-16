import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, Linking, Keyboard, InteractionManager, ActivityIndicator, Modal, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { updateEmployeeInfo, deleteEmployee } from '../actions'
import { Navigation } from 'react-native-navigation'
import DateTimePicker from '@react-native-community/datetimepicker'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MyInput from '../components/MyInput'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

class EmployeeDetailsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false, modalVisible: false }
    InteractionManager.runAfterInteractions(() => {
      this.separator = () => <View style={{ marginVertical: 2 }}></View>
      this.uid = this.props.uid
      const { data: { name, role, salary, phone, email, joinDate } } = this.props
      this.setState({ canRender: true, name, role, salary, phone, email, joinDate, showDatePicker: false })
      this.employeeData = this.props.data
    })
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
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({ modalVisible: false })
            }}>
            <View
              style={{
                backgroundColor: this.useTheme('rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)'),
                flex: 1,
                justifyContent: 'center'
              }}
            >
              <View style={{
                ...styles.modal,
                backgroundColor: this.useTheme('#f5f5f5', '#222')
              }}>
                <View style={{
                  ...styles.upperModal,
                  backgroundColor: this.useTheme('#f5f5f5', '#222')
                }}>
                  <Text style={{
                    marginBottom: 7,
                    textAlign: 'center',
                    color: this.useTheme('#303030', '#fbfbfb'),
                    fontSize: 18,
                    fontFamily: 'SourceSansPro-SemiBold'
                  }}>
                    Delete this employee?
                  </Text>
                  <Text style={{
                    textAlign: 'center',
                    color: this.useTheme('#444', '#fbfbfb'),
                    fontSize: 16,
                    fontFamily: 'SourceSansPro-SemiBold'
                  }}>
                    This action cannot be undo.
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      this.setState({ modalVisible: false });
                    }}
                    style={[
                      styles.modalButton,
                      {
                        borderBottomLeftRadius: 4,
                        backgroundColor: this.useTheme('#f5f5f5', '#222'),
                        borderTopColor: this.useTheme('#eaeaea', '#363636')
                      }]}>
                    <Text style={{ color: this.useTheme('#303030', '#eef'), fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      this.setState({ modalVisible: false });
                      this.props.deleteEmployee(this.props.componentId, { uid: this.uid }, this.employeeData)
                    }}
                    style={[
                      styles.modalButton,
                      {
                        borderBottomRightRadius: 4,
                        backgroundColor: this.useTheme('#f5f5f5', '#222'),
                        borderTopColor: this.useTheme('#eaeaea', '#363636')
                      }]}>
                    <Text style={{ color: '#e65100', fontSize: 19, fontFamily: 'SourceSansPro-SemiBold' }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginRight: 15 }}
                contentContainerStyle={{ alignItems: 'center' }}
              >
                <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 25, fontFamily: 'SourceSansPro-SemiBold', textAlign: 'left' }}>
                  {this.props.data.name}
                </Text>
              </ScrollView>
            </View>
            <TouchableOpacity
              style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
              activeOpacity={0.2}
              onPress={() => this.setState({ modalVisible: true })}
            >
              <MaterialCommunityIcons name="trash-can-outline" color={this.useTheme('#303030', '#fbfbfb')} size={24} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <MyInput
              theme={this.props.theme}
              leftIcon='ios-person'
              inputContainerStyle={{ marginTop: 10, marginBottom: 8 }}
              value={this.state.name}
              style={{ fontSize: 16, paddingRight: 15 }}
              isSecure={false}
              autoCapitalize="words"
              placeHolder='Name'
              isAutoCorrect={false}
              onChangeText={value => this.setState({ name: value })}
            />
            <MyInput
              theme={this.props.theme}
              autoCapitalize="words"
              value={this.state.role}
              inputContainerStyle={{ marginVertical: 8 }}
              leftIcon='ios-briefcase'
              style={{ fontSize: 16, paddingRight: 15 }}
              isSecure={false}
              placeHolder='Role'
              isAutoCorrect={false}
              onChangeText={value => this.setState({ role: value })}
            />
            <MyInput
              theme={this.props.theme}
              keyboardType="decimal-pad"
              value={this.state.salary}
              inputContainerStyle={{ marginVertical: 8 }}
              leftIcon='ios-cash'
              style={{ fontSize: 16, paddingRight: 15 }}
              isSecure={false}
              placeHolder='Salary'
              isAutoCorrect={false}
              onChangeText={value => this.setState({ salary: value })}
            />
            <MyInput
              keyboardType="number-pad"
              theme={this.props.theme}
              value={this.state.phone}
              inputContainerStyle={{ marginVertical: 8 }}
              leftIcon='ios-call'
              rightIcon='ios-arrow-forward'
              rightIconStyle={{
                color: this.state.phone ?
                  this.useTheme('#777', '#c8c8c8')
                  :
                  this.useTheme('#c8c8c8', '#777')
              }}
              isRightIconDisabled={!this.state.phone}
              onRightIconPress={() => Linking.openURL(`tel:${this.state.phone}`)}
              style={{ fontSize: 16, paddingRight: 15 }}
              isSecure={false}
              placeHolder='Phone'
              isAutoCorrect={false}
              onChangeText={value => this.setState({ phone: value })}
            />
            <MyInput
              keyboardType="email-address"
              inputContainerStyle={{ marginVertical: 8 }}
              value={this.state.email}
              leftIcon='ios-mail'
              rightIcon='ios-arrow-forward'
              rightIconStyle={{
                color: this.state.email ?
                  this.useTheme('#777', '#c8c8c8')
                  :
                  this.useTheme('#c8c8c8', '#777')
              }}
              isRightIconDisabled={!this.state.email}
              onRightIconPress={() => { Linking.openURL(`mailto:${this.state.email}`) }}
              style={{ fontSize: 16, paddingRight: 15 }}
              isSecure={false}
              placeHolder='Email'
              isAutoCorrect={false}
              theme={this.props.theme}
              onChangeText={value => this.setState({ email: value })}
            />
            <MyInput
              theme={this.props.theme}
              inputContainerStyle={{ marginVertical: 8 }}
              onTouchStart={() => {
                Keyboard.dismiss()
                this.setState({ showDatePicker: true })
              }}
              editable={false}
              value={'Joined since :  ' + ("0" + new Date(this.state.joinDate).getDate()).slice(-2) + "-" + ("0" + (new Date(this.state.joinDate).getMonth() + 1)).slice(-2) + "-" + new Date(this.state.joinDate).getFullYear()}
              leftIcon='md-calendar'
              inputContainerStyle={{ marginVertical: 8 }}
              style={{ fontSize: 16, paddingRight: 15 }}
            />
            {
              this.state.showDatePicker
              &&
              <DateTimePicker
                timeZoneOffsetInMinutes={0}
                value={this.state.joinDate}
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
            style={{
              elevation: 3,
              backgroundColor: this.useTheme('#f5f5f5', '#222'),
              height: 52,
              marginBottom: 24,
              alignSelf: 'flex-end',
              borderRadius: 26,
              alignItems: 'center',
              marginRight: 9,
              justifyContent: 'center'
            }}
            onPress={() => {
              const { name, role, salary, phone, email, joinDate } = this.state
              this.props.updateEmployeeInfo(this.props.componentId, { name, role, salary, phone, email, joinDate, uid: this.uid })
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 18 }}>
              <MaterialIcons name="done" color="#008ee0" size={25} style={{ marginRight: 5 }} />
              <Text style={{
                marginLeft: 5,
                fontFamily: 'SourceSansPro-SemiBold',
                color: '#008ee0',
                fontSize: 16.5
              }}>
                Update
              </Text>
            </View>
          </TouchableOpacity>
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
    marginBottom: 15,
    paddingHorizontal: 4,
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center'
  },
  backIconContainer: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: 250,
    height: 135,
    alignSelf: 'center',
    borderRadius: 4
  },
  upperModal: {
    height: 90,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center'
  },
  modalButton: {
    height: 45,
    width: 125,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1.5
  }
})

const mapDispatchToProps = dispatch => ({
  updateEmployeeInfo: (componentId, { name, role, salary, phone, email, joinDate, uid }) => dispatch(updateEmployeeInfo(componentId, { name, role, salary, phone, email, joinDate, uid })),
  deleteEmployee: (componentId, { uid }, employeeData) => dispatch(deleteEmployee(componentId, { uid }, employeeData))
})

export default connect(
  ({ app }) => ({ theme: app.theme }),
  mapDispatchToProps
)(EmployeeDetailsScreen)