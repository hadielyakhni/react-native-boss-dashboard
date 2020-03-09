import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { addMoneyAccount, updateOnScreenAccountInfo, resetAccount } from '../actions'
import { Icon, Spinner } from 'native-base'
import Dialog, { DialogContent, FadeAnimation } from 'react-native-popup-dialog'
import MyButton from '../components/MyButton'
import AccountForm from '../components/AccountForm'

class MoneyAddScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Add an account',
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
  constructor() {
    super()
    this.state = {
      name: '',
      status: 'ME',
      amount1: 0,
      amount2: 0,
      amount3: 0,
      amount4: 0
    }
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
      case 'amount4':
        this.setState({ 'amount4': value })
        break
    }
  }
  render() {
    const { name, status, amount1, amount2, amount3, amount4 } = this.state
    return (
      <View style={styles.container}>
        <Dialog
          useNativeDriver={true}
          rounded={true}
          dialogStyle={[styles.dialogStyle, { height: 145 }]}
          visible={this.props.addingAccount}
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
        <AccountForm
          data={this.state}
          updateInputs={this.updateState}
        />
        <View style={styles.addButtonView}>
          <MyButton
            style={styles.addButton}
            onPress={() => {
              const total = amount1 + amount2 + amount3 + amount4
              return this.props.addMoneyAccount({ name, status, amount: total, amount1, amount2, amount3, amount4 })
            }}
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
    paddingTop: 15,
    paddingHorizontal: 10
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
  addButtonView: {
    height: 125,
    justifyContent: 'center'
  },
  addButton: {
    borderRadius: 10,
    height: 56
  },
  dialogStyle: {
    height: 175,
    width: 265,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

const mapDispatchToProps = dispatch => {
  return {
    resetAccount: () => dispatch(resetAccount()),
    addMoneyAccount: ({ name, status, amount, amount1, amount2, amount3, amount4 }) => {
      return dispatch(addMoneyAccount({ name, status, amount, amount1, amount2, amount3, amount4 }))
    },
    updateOnScreenAccountInfo: ({ prop, value }) => dispatch(updateOnScreenAccountInfo({ prop, value }))
  }
}

const mapStateToProps = state => ({
  addingAccount: state.money.addingAccount
})

export default connect(mapStateToProps, mapDispatchToProps)(MoneyAddScreen)