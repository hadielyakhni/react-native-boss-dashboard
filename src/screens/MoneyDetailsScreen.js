import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    // UIManager,
    // LayoutAnimation
} from 'react-native'
import { connect } from 'react-redux'
import { updateAccountInfo, deleteAccount } from '../actions'
import { Icon, Spinner } from 'native-base'
import Dialog, {
    SlideAnimation,
    FadeAnimation,
    DialogContent,
    DialogFooter,
    DialogButton
} from 'react-native-popup-dialog'
import SpinKit from 'react-native-spinkit'
import AccountForm from '../components/AccountForm'
import MyButton from '../components/MyButton'

// UIManager.setLayoutAnimationEnabledExperimental &&
//     UIManager.setLayoutAnimationEnabledExperimental(true)

class MoneyDetailsScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Account Details',
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
        const data = this.props.navigation.getParam('data', '')
        this.uid = data[0]
        this.params = data[1]
        const { name, status, amount1, amount2, amount3 } = this.params
        this.state = {
            name,
            status,
            amount1,
            amount2,
            amount3,
            dialogVisible: false,
            canRender: false
        }
    }
    componentDidMount() {
        setTimeout(() => { this.setState({ canRender: true }) }, 1000)
    }
    updateState = (prop, value) => {
        switch (prop) {
            case 'name':
                this.setState({ 'name': value })
                break
            case 'status':
                this.setState({ 'status': value })
                break
            case 'amount1':
                this.setState({ 'amount1': value })
                break
            case 'amount2':
                this.setState({ 'amount2': value })
                break
            case 'amount3':
                this.setState({ 'amount3': value })
                break
        }
    }
    deletePressed = () => {
        this.setState({ dialogVisible: true })
    }
    renderContent() {
        if (this.state.canRender) {
            const { name, status, amount1, amount2, amount3 } = this.state
            const amount = amount1 + amount2 + amount3
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
                                        this.props.deleteAccount({ uid: this.uid })
                                    }}
                                />
                            </DialogFooter>
                        }
                        onTouchOutside={() => {
                            this.setState({ dialogVisible: false })
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
                        visible={this.props.deletingAccount}
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
                        visible={this.props.updatingAccount}
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
                    <AccountForm
                        data={this.state}
                        updateInputs={this.updateState}
                        nameViewStyle={{ paddingTop: 0, paddingBottom: 22 }}
                        sliderStyle={{ marginTop: 5, marginBottom: 28 }}
                    />
                    <View style={styles.buttonView}>
                        <MyButton
                            style={{ height: 55 }}
                            textStyle={{ fontSize: 20 }}
                            onPress={() => this.props.updateAccountInfo({ name, status, amount, amount1, amount2, amount3, uid: this.uid })}
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
        else
            return (
                <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
                    <SpinKit type='Wave' size={42} color='#008ee0' />
                </View>
            )
    }
    render() {
        return this.renderContent()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 25
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
    buttonView: {
        height: 150,
        justifyContent: 'space-evenly'
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
    updateAccountInfo: ({ name, status, amount, amount1, amount2, amount3, uid }) => {
        return dispatch(updateAccountInfo({ name, status, amount, amount1, amount2, amount3, uid }))
    },
    deleteAccount: ({ uid }) => dispatch(deleteAccount({ uid }))
})

const mapStateToProps = state => ({
    deletingAccount: state.money.deletingAccount,
    updatingAccount: state.money.updatingAccount
})

export default connect(mapStateToProps, mapDispatchToProps)(MoneyDetailsScreen)