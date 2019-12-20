import React, { Component } from 'react'
import { TextInput, View, StyleSheet } from 'react-native'

export default class MyInput extends Component {
  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          editable={this.props.editable}
          value={this.props.value}
          secureTextEntry={this.props.isSecure}
          keyboardType={this.props.keyboardType}
          style={[styles.InputStyle, this.props.style]}
          placeholder={this.props.placeHolder}
          placeholderTextColor='rgba(255, 255, 255, 0.6)'
          autoCapitalize='none'
          autoCorrect={this.props.isAutoCorrect}
          onChangeText={this.props.onChangeText}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 10
  },
  InputStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    height: 45,
    borderRadius: 5,
    paddingLeft: 15,
    fontSize: 14,
    color: '#fff'
  }
})