import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'

export default class MyButton extends PureComponent {
  render() {
    const { onPress, style, color, disabledColor, disabled, textStyle, children, activeOpacity } = this.props
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, style, { backgroundColor: color }]}
        activeOpacity={activeOpacity || 0.75}
        disabled={disabled}
      >
        <Text style={[styles.text, textStyle, { color: disabled ? '#e3e3e3' : '#f9f9f9' }]}>
          {children}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    height: 45,
    borderRadius: 5,
    justifyContent: 'center'
  },
  text: {
    marginHorizontal: 5,
    fontSize: 17.8,
    fontFamily: 'SourceSansPro-SemiBold'
  }
})
