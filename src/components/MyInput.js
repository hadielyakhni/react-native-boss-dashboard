import React, { PureComponent } from 'react'
import { TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'
import { isRTL } from '../utils/i18n'

export default class MyInput extends PureComponent {
  renderButton() {
    if (this.props.rightIcon)
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          disabled={this.props.isRightIconDisabled}
          style={styles.rightIconContainer}
          onPress={this.props.onRightIconPress}
        >
          <Icon
            name={this.props.rightIcon}
            style={[styles.iconRight, this.props.rightIconStyle]}
          />
        </TouchableOpacity>
      )
  }
  render() {
    return (
      <View
        onTouchStart={this.props.onTouchStart || null}
        style={[
          styles.inputContainer,
          this.props.inputContainerStyle,
          {
            backgroundColor: this.props.theme === 'light' ? '#f9f9f9' : '#444',
            borderWidth: this.props.theme === 'light' ? 0.8 : 0,
            borderColor: '#d8d8d8'
          }
        ]}>
        {this.props.leftIcon && <Icon name={this.props.leftIcon} style={[styles.iconLeft, this.props.leftIconStyle]} />}
        <TextInput
          theme={this.props.theme}
          editable={this.props.editable}
          value={this.props.value}
          secureTextEntry={this.props.isSecure}
          keyboardType={this.props.keyboardType}
          style={[
            styles.InputStyle,
            this.props.style,

            { textAlign: isRTL() ? 'right' : 'left', color: this.props.theme === 'light' ? '#303030' : '#fbfbfb' }
          ]}
          placeholder={this.props.placeHolder}
          placeholderTextColor={this.props.theme === 'light' ? '#999' : 'rgba(255, 255, 255, 0.6)'}
          autoCapitalize={this.props.autoCapitalize || 'none'}
          autoCorrect={this.props.isAutoCorrect}
          onChangeText={this.props.onChangeText}
        />
        {this.renderButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: 5,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  InputStyle: {
    flex: 1,
    height: 45,
    borderRadius: 5,
    fontSize: 16.5,
    paddingRight: 10,
    fontFamily: 'SourceSansPro-Regular'
  },
  iconLeft: {
    paddingHorizontal: 14,
    fontSize: 24,
    color: '#008ee0'
  },
  rightIconContainer: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconRight: {
    paddingHorizontal: 10,
    fontSize: 24
  }
})