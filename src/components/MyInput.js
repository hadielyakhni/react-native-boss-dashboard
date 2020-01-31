import React, { Component } from 'react'
import { TextInput, View, StyleSheet } from 'react-native'
import { Icon } from 'native-base'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default class MyInput extends Component {
    renderButton() {
        if (this.props.rightIcon)
            return (
                <TouchableOpacity style={styles.rightIconContainer} onPress={this.props.onRightIconPress}>
                    <Icon name={this.props.rightIcon} style={[styles.iconRight, this.props.rightIconStyle]} />
                </TouchableOpacity>
            )
    }
    render() {
        return (
            <View style={styles.inputContainer}>
                <Icon name={this.props.leftIcon} style={[styles.iconLeft, this.props.leftIconStyle]} />
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
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.22)',
    },
    InputStyle: {
        flex: 1,
        height: 45,
        borderRadius: 5,
        fontSize: 14,
        color: '#fff'
    },
    iconLeft: {
        paddingHorizontal: 15,
        fontSize: 23,
        color: '#008ee0'
    },
    rightIconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconRight: {
        paddingHorizontal: 15,
        color: '#fff'
    }
})