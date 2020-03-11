import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet, Text } from 'react-native'

export default class MyButton extends PureComponent {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[styles.button, this.props.style]}
        activeOpacity={0.75}
      >
        <Text style={[styles.text, this.props.textStyle]}>
          {this.props.children}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#008ee0',
    alignItems: 'center',
    height: 45,
    borderRadius: 5,
    justifyContent: 'center'
  },
  text: {
    marginHorizontal: 5,
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold'
  }
})
