import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Linking } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import {
    updateOnScreenEmployeeInfo,
    updateEmployeeInfo,
    deleteEmployee
} from '../actions'
import Dialog, {
    SlideAnimation,
    FadeAnimation,
    DialogContent,
    DialogFooter,
    DialogButton
} from 'react-native-popup-dialog'
import { Spinner } from 'native-base'
import MyInput from '../components/MyInput'
import MyButton from '../components/MyButton'

class EmployeeDetailsScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('data', '').name,
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
        this.state = { dialogVisible: false }
        this.separator = () => <View style={{ marginVertical: 2 }}></View>
    }
    componentDidMount() {
        this.uid = this.props.navigation.getParam('uid', null)
        const data = this.props.navigation.getParam('data', '')
        Object.keys(data).map(prop => {
            this.props.updateOnScreenEmployeeInfo({ prop, value: data[prop] })
        })
    }
    deletePressed = () => {
        this.setState({ dialogVisible: true })
    }
    render() {
        const { name, role, salary, phone, email } = this.props
        return (
            <View style={styles.container}>
                <Dialog
                    useNativeDriver={true}
                    rounded={true}
                    dialogStyle={styles.dialogStyle}
                    visible={this.state.dialogVisible}
                    dialogAnimation={new SlideAnimation({
                        initialValue: 0,
                        slideFrom: 'bottom',
                        useNativeDriver: true,
                    })}
                    footer={
                        <DialogFooter bordered={false}>
                            <DialogButton
                                textStyle={{ color: '#008ee0', fontSize: 18, fontWeight: 'bold' }}
                                text="CANCEL"
                                onPress={() => this.setState({ dialogVisible: false })}
                            />
                            <DialogButton
                                textStyle={{ color: '#008ee0', fontSize: 18, fontWeight: 'bold' }}
                                text="YES"
                                onPress={() => {
                                    this.setState({ dialogVisible: false });
                                    this.props.deleteEmployee({ uid: this.uid })
                                }}
                            />
                        </DialogFooter>
                    }
                    onTouchOutside={() => {
                        this.setState({ dialogVisible: false });
                    }}
                    onHardwareBackPress={() => {
                        console.log('hardware button pressed')
                        this.setState({ dialogVisible: false })
                    }}
                >
                    <DialogContent>
                        <View style={{
                            height: 75,
                            marginTop: 15,
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                                This action can't be undo!
                            </Text>
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                                Are You Sure?
                            </Text>
                        </View>
                    </DialogContent>
                </Dialog>
                <Dialog
                    useNativeDriver={true}
                    rounded={true}
                    dialogStyle={[styles.dialogStyle, { height: 145 }]}
                    visible={this.props.deletingEmployee}
                    dialogAnimation={new FadeAnimation({
                        initialValue: 0,
                        animationDuration: 150,
                        useNativeDriver: true,
                    })}
                >
                    <DialogContent style={{ paddingTop: 30, alignItems: 'center', flex: 1, width: 200 }}>
                        <Text style={{ color: '#fff', fontSize: 23, fontWeight: 'bold' }}>
                            Deleting...
                        </Text>
                        <Spinner size={30} color='#008ee0' />
                    </DialogContent>
                </Dialog>
                <Dialog
                    useNativeDriver={true}
                    rounded={true}
                    dialogStyle={[styles.dialogStyle, { height: 145 }]}
                    visible={this.props.updatingEmployee}
                    dialogAnimation={new FadeAnimation({
                        initialValue: 0,
                        animationDuration: 150,
                        useNativeDriver: true,
                    })}
                >
                    <DialogContent style={{ paddingTop: 30, alignItems: 'center', flex: 1, width: 200 }}>
                        <Text style={{ color: '#fff', fontSize: 23, fontWeight: 'bold' }}>
                            Updating...
                        </Text>
                        <Spinner size={30} color='#008ee0' />
                    </DialogContent>
                </Dialog>
                <MyInput
                    leftIcon='ios-person'
                    value={name}
                    style={{ fontSize: 16 }}
                    isSecure={false}
                    placeHolder='Name'
                    isAutoCorrect={false}
                    onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'name', value })}
                />
                <MyInput
                    value={role}
                    leftIcon='ios-briefcase'
                    style={{ fontSize: 16 }}
                    isSecure={false}
                    placeHolder='Role'
                    isAutoCorrect={false}
                    onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'role', value })}
                />
                <MyInput
                    value={salary}
                    leftIcon='ios-cash'
                    style={{ fontSize: 16 }}
                    isSecure={false}
                    placeHolder='Salary'
                    isAutoCorrect={false}
                    onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'salary', value })}
                />
                <MyInput
                    value={phone}
                    leftIcon='ios-call'
                    rightIcon='ios-arrow-forward'
                    onRightIconPress={() => Linking.openURL(`tel:${phone}`)}
                    style={{ fontSize: 16 }}
                    isSecure={false}
                    placeHolder='Phone'
                    isAutoCorrect={false}
                    onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'phone', value })}
                />
                <MyInput
                    value={email}
                    leftIcon='ios-mail'
                    rightIcon='ios-arrow-forward'
                    onRightIconPress={() => Linking.openURL(`mailto:${email}`)}
                    style={{ fontSize: 16 }}
                    isSecure={false}
                    placeHolder='Email'
                    isAutoCorrect={false}
                    onChangeText={value => this.props.updateOnScreenEmployeeInfo({ prop: 'email', value })}
                />
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <MyButton
                        style={{ marginBottom: 10, height: 50 }}
                        textStyle={{ fontSize: 20 }}
                        onPress={() => this.props.updateEmployeeInfo({ name, role, salary, phone, email, uid: this.uid })}
                    >Save</MyButton>
                    <MyButton
                        style={{ marginBottom: 20, height: 50, backgroundColor: '#E65100' }}
                        textStyle={{ fontSize: 20 }}
                        onPress={this.deletePressed}
                    >Delete</MyButton>
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
        height: 165,
        width: 265,
        backgroundColor: '#121212',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

const mapDispatchToProps = dispatch => ({
    updateOnScreenEmployeeInfo: ({ prop, value }) => dispatch(updateOnScreenEmployeeInfo({ prop, value })),
    updateEmployeeInfo: ({ name, role, salary, phone, email, uid }) => dispatch(updateEmployeeInfo({ name, role, salary, phone, email, uid })),
    deleteEmployee: ({ uid }) => dispatch(deleteEmployee({ uid }))
})

const mapStateToProps = state => {
    const { name, role, salary, phone, email, deletingEmployee, updatingEmployee } = state.employees
    return {
        name,
        role,
        salary,
        phone,
        email,
        updatingEmployee,
        deletingEmployee
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetailsScreen)