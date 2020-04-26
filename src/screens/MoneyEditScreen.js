import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Keyboard, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { editAccountInfo } from '../actions'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MyInput from '../components/MyInput'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { translate, isRTL } from '../utils/i18n'

class MoneyEditScreen extends React.PureComponent {
  state = {
    name: this.props.name,
    phone: this.props.phone,
    isKeyboardOpened: false
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
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          ...styles.container,
          backgroundColor: this.useTheme('#f5f5f5', '#161616')
        }}>
        <View style={{
          ...styles.header,
          backgroundColor: this.useTheme('#f5f5f5', '#161616')
        }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => Navigation.pop(this.props.componentId)}
            style={{
              ...styles.backIconContainer,
              backgroundColor: this.useTheme('#f5f5f5', '#161616')
            }}
          >
            <Ionicons name={isRTL() ? "md-arrow-forward" : "md-arrow-back"} size={26} color={this.useTheme('#303030', '#fbfbfb')} />
          </TouchableOpacity>
          <View style={{
            ...styles.titleContainer,
            backgroundColor: this.useTheme('#f5f5f5', '#161616')
          }}>
            <Text
              numberOfLines={1}
              style={{
                color: this.useTheme('#303030', '#fbfbfb'),
                fontSize: 25,
                fontFamily: 'SourceSansPro-SemiBold'
              }}>
              {translate('main.moneyEdit.title')}
            </Text>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <MyInput
            theme={this.props.theme}
            placeHolder={translate('main.moneyEdit.name')}
            leftIcon='ios-person'
            style={{ fontSize: 17, paddingRight: 15 }}
            inputContainerStyle={{ marginTop: 15 }}
            value={this.state.name}
            autoCapitalize="words"
            onChangeText={name => this.setState({ name })}
          />
          <MyInput
            theme={this.props.theme}
            keyboardType="number-pad"
            placeHolder={translate('main.moneyEdit.phone')}
            inputContainerStyle={{ marginTop: 10 }}
            leftIcon='ios-call'
            style={{ fontSize: 17, paddingRight: 15 }}
            value={this.state.phone}
            onChangeText={phone => this.setState({ phone })}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.92}
          style={{
            elevation: 3,
            backgroundColor: this.useTheme('#f5f5f5', '#222'),
            height: 52,
            marginBottom: this.state.isKeyboardOpened ? 60 : 25,
            alignSelf: 'flex-end',
            borderRadius: 26,
            alignItems: 'center',
            marginRight: 9,
            justifyContent: 'center'
          }}
          onPress={() => {
            const { accountId, componentId } = this.props
            const { name, phone } = this.state
            this.props.editAccountInfo(accountId, name.trim(), phone, componentId)
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
              {translate('main.moneyEdit.update')}
            </Text>
          </View>
        </TouchableOpacity>
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
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  backIconContainer: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainContainer: {
    paddingHorizontal: 12,
    marginTop: 10,
    flex: 1
  },
  updateButton: {
    height: 56,
    marginHorizontal: 10,
    backgroundColor: '#008ee0',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 15
  }
})

export default connect(
  ({ app }) => ({ theme: app.theme }),
  { editAccountInfo }
)(MoneyEditScreen)