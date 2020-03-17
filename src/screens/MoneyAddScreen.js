import React, { Component } from 'react'
import { Text, StyleSheet, View, InteractionManager, ActivityIndicator, Modal } from 'react-native'
import { connect } from 'react-redux'
import { addMoneyAccount, resetAccount } from '../actions'
import { Spinner } from 'native-base'
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
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.addingAccount}>
            <View style={[styles.loadingModalContainer]} >
              <View style={styles.loadingModal}>
                <Spinner color='#eeeeee' size={27} style={{ marginRight: 0 }} />
                <Text style={{ color: '#eeeeee', fontSize: 15 }}>Adding...</Text>
              </View>
            </View>
          </Modal>
          <AccountForm
            data={this.state}
            updateInputs={this.updateState}
          />
          <View style={styles.addButtonView}>
            <MyButton
              style={styles.addButton}
              color='#008ee0'
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
  loadingModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingModal: {
    borderRadius: 6,
    backgroundColor: '#171717',
    width: 140,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
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