import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  InteractionManager,
  Animated,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native'
import { connect } from 'react-redux'
import { addMoneyAccount } from '../actions'
import MyInput from '../components/MyInput'
import { CheckBox } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { translate, isRTL } from '../utils/i18n'
import Shimmer from 'react-native-shimmer'

class MoneyAddScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        this.setState({ canRender: true })
        Animated.timing(this.mainViewOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        }).start()
      }, 75)
      this.mainViewOpacity = new Animated.Value(0)
      this.setState({
        name: '',
        phone: '',
        amount: '',
        status: 'ME',
        isAddButtonDisabled: false,
        isKeyboardOpened: false
      })
    })
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpened: true })
  }
  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpened: false })
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
      <KeyboardAvoidingView behavior="padding" style={{
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
            <Ionicons name={isRTL() ? "md-arrow-forward" : "md-arrow-back"} size={26} color={this.useTheme('#303030', '#fbfbfb')} />
          </TouchableOpacity>
          <View style={{
            ...styles.titleContainer,
            backgroundColor: this.useTheme('#f5f5f5', '#161616')
          }}>
            <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 25, fontFamily: 'SourceSansPro-SemiBold' }}>
              {translate('main.moneyAdd.title')}
            </Text>
          </View>
        </View>
        {
          this.state.canRender ?
            <Animated.View style={{ flex: 1, paddingHorizontal: 12, opacity: this.mainViewOpacity }}>
              <View style={styles.formContainer}>
                <MyInput
                  theme={this.props.theme}
                  placeHolder={translate('main.moneyAdd.field1')}
                  leftIcon='ios-person'
                  style={{ fontSize: 17, paddingRight: 15 }}
                  inputContainerStyle={{ marginTop: 15 }}
                  value={name}
                  autoCapitalize="words"
                  onChangeText={name => this.setState({ name })}
                />
                <MyInput
                  theme={this.props.theme}
                  placeHolder={translate('main.moneyAdd.field2')}
                  leftIcon='ios-cash'
                  inputContainerStyle={{ marginTop: 15 }}
                  style={{ fontSize: 17, paddingRight: 15 }}
                  value={amount}
                  keyboardType="decimal-pad"
                  onChangeText={amount => this.setState({ amount })}
                />
                <MyInput
                  theme={this.props.theme}
                  keyboardType="number-pad"
                  placeHolder={translate('main.moneyAdd.field3')}
                  inputContainerStyle={{ marginTop: 15 }}
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
                  <Text style={{ fontSize: 17, fontFamily: 'SourceSansPro-Bold', color: this.useTheme('#303030', '#f9f9f9') }}>
                    {translate('main.moneyAdd.forMe')}
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
                    {translate('main.moneyAdd.forHim')}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.92}
                disabled={this.isAddDisabled()}
                style={{
                  elevation: this.isAddDisabled() ? 2 : 4,
                  backgroundColor: this.useTheme('#f5f5f5', '#222'),
                  height: 52,
                  marginBottom: this.state.isKeyboardOpened ? 44 : 24,
                  alignSelf: 'flex-end',
                  borderRadius: 26,
                  alignItems: 'center',
                  marginRight: 4,
                  justifyContent: 'center'
                }}
                onPress={() => {
                  this.setState({ isAddButtonDisabled: true })
                  setTimeout(() => {
                    this.setState({ isAddButtonDisabled: false })
                  }, 300);
                  return this.props.addMoneyAccount(this.props.componentId, { name, phone, status, amount: amount || 0 })
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
                      {translate('main.moneyAdd.add')}
                    </Text>
                  </View>
                }
              </TouchableOpacity>
            </Animated.View>
            :
            <View style={{ paddingHorizontal: 16, paddingTop: 25, flex: 1, backgroundColor: this.useTheme('#f5f5f5', '#161616'), }}>
              <Shimmer direction={!isRTL() ? 'right' : 'left'} animationOpacity={0.85} style={{ marginVertical: 5, width: '50%' }}>
                <Text numberOfLines={1} style={{
                  ...styles.item,
                  backgroundColor: this.props.theme === 'light' ? '#e6e6e6' : '#222'
                }}>
                </Text>
              </Shimmer>
              <Shimmer direction={!isRTL() ? 'right' : 'left'} animationOpacity={0.85} style={{ marginTop: 16 }}>
                <Text numberOfLines={1} style={{
                  ...styles.item,
                  backgroundColor: this.props.theme === 'light' ? '#e6e6e6' : '#222'
                }}>
                </Text>
              </Shimmer>
              <Shimmer direction={!isRTL() ? 'right' : 'left'} animationOpacity={0.85} style={{ marginTop: 14 }}>
                <Text numberOfLines={1} style={{
                  ...styles.item,
                  backgroundColor: this.props.theme === 'light' ? '#e6e6e6' : '#222'
                }}>
                </Text>
              </Shimmer>
              <Shimmer direction={!isRTL() ? 'right' : 'left'} animationOpacity={0.85} style={{ marginTop: 14 }}>
                <Text numberOfLines={1} style={{
                  ...styles.item,
                  backgroundColor: this.props.theme === 'light' ? '#e6e6e6' : '#222'
                }}>
                </Text>
              </Shimmer>
            </View>
        }
      </KeyboardAvoidingView>
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
    padding: 6,
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