import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Text,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'
import { Spinner } from 'native-base'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'
import { emailChanged, passwordChanged, userSignin, resetAuth } from '../actions'

class LoginScreen extends Component {
    constructor() {
        super()
        this.keyboardDidShowListner = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
        this.keyboardDidHideListner = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
        this.state = {
            isKeyboardOpened: false
        }
    }
    _keyboardDidShow = () => {
        this.setState({ isKeyboardOpened: true })
    }
    _keyboardDidHide = () => {
        this.setState({ isKeyboardOpened: false })
    }
    onSignin = () => {
        const { email, password, userSignin } = this.props
        userSignin(email, password)
    }
    renderLoginButton() {
        if (!this.props.loading)
            return (
                <MyButton
                    style={{ marginTop: 15, marginBottom: 10, }}
                    onPress={this.onSignin.bind(this)}
                >Log In</MyButton>
            )
        return (
            <View style={styles.loadingContainer}>
                <Spinner color='#fff' size={33} />
            </View>
        )
    }
    renderError() {
        if (this.props.error != '')
            return (
                <View>
                    <Text style={styles.errorStyle}>
                        {this.props.error}
                    </Text>
                </View>
            )
        return <View style={{ height: 20 }} />
    }
    render() {
        const { email, password, emailChanged, passwordChanged } = this.props
        return (
            <View style={styles.container}>
                <View style={{ paddingBottom: this.state.isKeyboardOpened ? 300 : 0 }}>
                    <Text style={[styles.title, { marginBottom: 0 }]}>Hadi's</Text>
                    <Text style={styles.title}> Top</Text>
                    <MyInput
                        keyboardType='email-address'
                        value={email}
                        isSecure={false}
                        placeHolder='Email'
                        isAutoCorrect={true}
                        onChangeText={text => emailChanged(text)}
                    />
                    <MyInput
                        value={password}
                        isSecure={true}
                        placeHolder='Password'
                        isAutoCorrect={false}
                        onChangeText={text => passwordChanged(text)}
                    />
                    {this.renderLoginButton()}
                    <MyButton>
                        Log In With Facebbok
                    </MyButton>
                    <View style={styles.signupOption}>
                        <Text style={styles.signupText}>
                            Don't have an account?
                        </Text>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.props.navigation.navigate('Signup')
                                this.props.resetAuth()
                            }}
                        >
                            <Text style={styles.signupLink}>
                                Sign up.
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ height: 72, justifyContent: 'center' }}>
                        {this.renderError()}
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 33,
        justifyContent: 'center',
        paddingBottom: 15
    },
    title: {
        marginBottom: 28,
        color: '#fff',
        fontSize: 55,
        alignSelf: 'center',
        fontFamily: 'PermanentMarker-Regular'
    },
    signupOption: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    signupText: {
        fontSize: 12.5,
        color: 'rgba(255, 255, 255, 0.6)',
        marginRight: 4
    },
    signupLink: {
        color: '#fff',
        fontSize: 12.5,
        fontWeight: 'bold'
    },
    loadingContainer: {
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: '#008ee0',
        alignItems: 'center',
        height: 45,
        borderRadius: 5,
        justifyContent: 'center'
    },
    errorStyle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#e64749',
        paddingLeft: 7
    }
})

const mapActionsToProps = dispatch => ({
    emailChanged: (email) => dispatch(emailChanged(email)),
    passwordChanged: (password) => dispatch(passwordChanged(password)),
    userSignin: (email, password) => dispatch(userSignin(email, password)),
    resetAuth: () => dispatch(resetAuth())
})

const mapStateToProps = state => {
    return {
        email: state.auth.email,
        password: state.auth.password,
        error: state.auth.error,
        loading: state.auth.loading
    }
}

export default connect(mapStateToProps, mapActionsToProps)(LoginScreen)