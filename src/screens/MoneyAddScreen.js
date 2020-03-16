import React, { Component } from 'react'
import { Text, StyleSheet, View, InteractionManager, ActivityIndicator } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { addMoneyAccount, resetAccount } from '../actions'
import { Spinner } from 'native-base'
import Dialog, { DialogContent, FadeAnimation } from 'react-native-popup-dialog'
import MyButton from '../components/MyButton'
import AccountForm from '../components/AccountForm'

class MoneyAddScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ canRender: true, name: '', status: 'ME', amount1: 0, amount2: 0, amount3: 0 })
      })
    }, 400);
  }
  updateState = (prop, value) => {
    this.setState({ [prop]: value })
  }
  render() {
    const { name, status, amount1, amount2, amount3 } = this.state
    return (
      this.state.canRender ?
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
                const total = amount1 + amount2 + amount3
                return this.props.addMoneyAccount(this.props.componentId, { name, status, amount: total, amount1, amount2, amount3 })
              }}
            >Add</MyButton>
          </View>
        </View>
        :
        <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#008ee0" size={38} />
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
    addMoneyAccount: (componentId, { name, status, amount, amount1, amount2, amount3 }) => (
      dispatch(addMoneyAccount(componentId, { name, status, amount, amount1, amount2, amount3 }))
    )
  }
}

const mapStateToProps = state => ({
  addingAccount: state.money.addingAccount
})

export default connect(mapStateToProps, mapDispatchToProps)(MoneyAddScreen)