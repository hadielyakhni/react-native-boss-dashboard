import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { addEmployee, updateOnScreenEmployeeInfo, resetEmployee } from '../actions'
import { Icon, Spinner } from 'native-base'
import Dialog, {
    FadeAnimation,
    DialogContent
} from 'react-native-popup-dialog'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'

class EmployeeAddScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Add An Employee',
        headerLeft: (
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon
                    name='ios-arrow-back'
                    style={styles.backIcon}
                />
            </TouchableOpacity>
        )
    })
    constructor(props) {
        super(props)
        this.separator = () => <View style={{ marginVertical: 2 }}></View>
    }
    componentDidMount() {
        this.props.resetEmployee()
    }
    render() {
        const { name, role, salary, phone, email } = this.props
        return (
            <View style={styles.container}>
                <Dialog
                    useNativeDriver={true}
                    rounded={true}
                    dialogStyle={[styles.dialogStyle, { height: 145 }]}
                    visible={this.props.addingEmployee}
                    dialogAnimation={new FadeAnimation({
                        initialValue: 0,
                        animationDuration: 150,
                        useNativeDriver: true,
                    })}
                >
                    <DialogContent style={{ paddingTop: 30, alignItems: 'center', flex: 1, width: 200 }}>
                        <Text style={{ color: '#fff', fontSize: 23, fontWeight: 'bold' }}>
                            Adding...
                        </Text>
                        <Spinner size={30} color='#008ee0' />
                    </DialogContent>
                </Dialog>
                <MyInput
                    value={name}
                    leftIcon='ios-person'
                    style={{ fontSize: 16 }}
                    isSecure={false}
                    placeHolder='Name'
                    isAutoCorrect={false}
                    onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'name', value })}
                />
                <this.separator />
                <MyInput
                    value={role}
                    leftIcon='ios-briefcase'
                    style={{ fontSize: 16 }}
                    isSecure={false}
                    placeHolder='Role'
                    isAutoCorrect={false}
                    onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'role', value })}
                />
                <this.separator />
                <MyInput
                    value={salary}
                    leftIcon='ios-cash'
                    style={{ fontSize: 16 }}
                    isSecure={false}
                    placeHolder='Salary'
                    isAutoCorrect={false}
                    onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'salary', value })}
                />
                <this.separator />
                <MyInput
                    value={phone}
                    leftIcon='ios-call'
                    style={{ fontSize: 16 }}
                    isSecure={false}
                    placeHolder='Phone'
                    isAutoCorrect={false}
                    onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'phone', value })}
                />
                <this.separator />
                <MyInput
                    value={email}
                    leftIcon='ios-maill'
                    style={{ fontSize: 16 }}
                    isSecure={false}
                    placeHolder='Email'
                    isAutoCorrect={false}
                    onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'email', value })}
                />
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <MyButton
                        style={{ marginBottom: 15, height: 50 }}
                        textStyle={{ fontSize: 20 }}
                        onPress={() => this.props.addEmployee({ name, role, salary, phone, email })}
                    >Add</MyButton>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 10,
        paddingTop: 15
    },
    backButton: {
        marginRight: 15,
        alignItems: 'center',
        marginLeft: 5
    },
    backIcon: {
        fontSize: 29,
        color: '#fff',
    },
    dialogStyle: {
        height: 175,
        width: 265,
        backgroundColor: '#121212',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

const mapActionsToProps = dispatch => ({
    updateOnScreenEmployeeInfo: ({ prop, value }) => dispatch(updateOnScreenEmployeeInfo({ prop, value })),
    addEmployee: ({ name, role, salary, phone, email }) => dispatch(addEmployee({ name, role, salary, phone, email })),
    resetEmployee: () => dispatch(resetEmployee())
})

const mapStateToProps = state => {
    const { name, role, salary, phone, email, addingEmployee } = state.employees
    return {
        name,
        role,
        salary,
        phone,
        email,
        addingEmployee
    }
}

export default connect(mapStateToProps, mapActionsToProps)(EmployeeAddScreen)