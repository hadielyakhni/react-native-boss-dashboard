import React, { Component } from 'react'
import { Text, StyleSheet, View, InteractionManager, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { addMoneyAccount } from '../actions'
import MyButton from '../components/MyButton'
import MyInput from '../components/MyInput'
import { CheckBox } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

class MoneyAddScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        canRender: true,
        name: '',
        phone: '',
        amount: '',
        status: 'ME',
        isAddButtonDisabled: false
      })
    })
  }
  isAddDisabled() {
    const { name, amount } = this.state
    if (!name || !amount || this.state.isAddButtonDisabled)
      return true
    return false
  }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  render() {
    const { name, phone, amount, status } = this.state
    return (
      this.state.canRender ?
        <View style={{
          ...styles.container,
          backgroundColor: this.useTheme('#f5f5f5', '#161616')
        }}>
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
                Add Account
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, paddingHorizontal: 12 }}>
            <View style={styles.formContainer}>
              <MyInput
                theme={this.props.theme}
                placeHolder="Name"
                leftIcon='ios-person'
                style={{ fontSize: 17, paddingRight: 15 }}
                inputContainerStyle={{ marginTop: 15 }}
                value={name}
                autoCapitalize="words"
                onChangeText={name => this.setState({ name })}
              />
              <MyInput
                theme={this.props.theme}
                placeHolder="How much money?"
                leftIcon='ios-cash'
                inputContainerStyle={{ marginTop: 10 }}
                style={{ fontSize: 17, paddingRight: 15 }}
                value={amount}
                keyboardType="decimal-pad"
                onChangeText={amount => this.setState({ amount })}
              />
              <MyInput
                theme={this.props.theme}
                keyboardType="number-pad"
                placeHolder="Phone number (optional)"
                inputContainerStyle={{ marginTop: 10 }}
                leftIcon='ios-call'
                style={{ fontSize: 17, paddingRight: 15 }}
                value={phone}
                onChangeText={phone => this.setState({ phone })}
              />
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState({ status: 'ME' })}
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, alignSelf: 'flex-start' }}>
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  uncheckedColor={this.useTheme('#999', '#ccc')}
                  checkedColor="#008ee0"
                  checked={status === 'ME'}
                  onPress={() => { this.setState({ status: 'ME' }) }}
                />
                <Text style={{ fontSize: 17, fontFamily: 'SourceSansPro-Bold', color: this.useTheme('#555', '#f9f9f9') }}>
                  FOR ME
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState({ status: 'HIM' })}
                style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}
              >
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  uncheckedColor={this.useTheme('#999', '#ccc')}
                  checkedColor='#de3b5b'
                  checked={status === 'HIM'}
                  onPress={() => { this.setState({ status: 'HIM' }) }}
                />
                <Text style={{ fontSize: 17, fontFamily: 'SourceSansPro-Bold', color: this.useTheme('#303030', '#fbfbfb') }}>
                  FOR HIM
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.addButtonView}>
              <MyButton
                disabled={this.isAddDisabled()}
                disabledColor='#355973'
                color='#008ee0'
                textStyle={{ fontSize: 19 }}
                style={[styles.addButton, { marginBottom: 0 }]}
                onPress={() => {
                  this.setState({ isAddButtonDisabled: true })
                  setTimeout(() => {
                    this.setState({ isAddButtonDisabled: false })
                  }, 300);
                  return this.props.addMoneyAccount(this.props.componentId, { name, phone, status, amount: amount || 0 })
                }}
              >Add</MyButton>
            </View>
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
  formContainer: {
    flex: 1
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
              2,
    marginBottom: 10,
    paddingHorizontal: 4
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
  checkBoxContainer: {
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 0,
    marginTop: 0,
    padding: 8,
    paddingLeft: 0
  },
  addButtonView: {
    height: 125,
    justifyContent: 'center'
  },
  addButton: {
    borderRadius: 10,
    height: 56
  }
})

const mapDispatchToProps = dispatch => {
  return {
    addMoneyAccount: (componentId, { name, phone, status, amount }) => (
      dispatch(addMoneyAccount(componentId, { name, phone, status, amount }))
    )
  }
}

export default connect(
  ({ app }) => ({ theme: app.theme }),
  mapDispatchToProps
)(MoneyAddScreen)