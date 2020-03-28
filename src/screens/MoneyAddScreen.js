import React, { Component } from 'react'
import { Text, StyleSheet, View, InteractionManager, ActivityIndicator, Modal, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { addMoneyAccount, resetAccount } from '../actions'
import { Spinner } from 'native-base'
import MyButton from '../components/MyButton'
import MyInput from '../components/MyInput'
import { CheckBox } from 'react-native-elements'

class MoneyAddScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    InteractionManager.runAfterInteractions(() => {
      this.setState({ canRender: true, name: '', name2: '', amount: '', status: 'ME', radioIndex: 0 })
    })
  }
  isAddDisabled() {
    const { name, name2, amount } = this.state
    if (!name || name.trim() !== name2.trim() || !amount)
      return true
    return false
  }
  render() {
    const { name, name2, amount, status } = this.state
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
          <View style={styles.formContainer}>
            <MyInput
              placeHolder="Name"
              leftIcon='ios-person'
              style={{ fontSize: 16 }}
              inputContainerStyle={{ marginTop: 15 }}
              value={name}
              autoCapitalize="words"
              onChangeText={name => this.setState({ name })}
            />
            <MyInput
              placeHolder="Confirm name"
              inputContainerStyle={{ marginTop: 10 }}
              leftIcon='ios-person'
              style={{ fontSize: 16 }}
              value={name2}
              autoCapitalize="words"
              onChangeText={name2 => this.setState({ name2 })}
            />
            <MyInput
              placeHolder="How much money?"
              leftIcon='ios-cash'
              inputContainerStyle={{ marginBottom: 20, marginTop: 10 }}
              style={{ fontSize: 16 }}
              value={amount}
              keyboardType="decimal-pad"
              onChangeText={amount => this.setState({ amount })}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.setState({ status: 'ME' })}
              style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, alignSelf: 'flex-start' }}>
              <CheckBox
                containerStyle={styles.checkBoxContainer}
                checkedColor="#008ee0"
                uncheckedColor="#008ee0"
                checked={status === 'ME'}
                onPress={() => { this.setState({ status: 'ME' }) }}
              />
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>FOR ME</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.setState({ status: 'HIM' })}
              style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}
            >
              <CheckBox
                containerStyle={styles.checkBoxContainer}
                checkedColor='#ff006a'
                uncheckedColor='#ff006a'
                checked={status === 'HIM'}
                onPress={() => { this.setState({ status: 'HIM' }) }}
              />
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>FOR HIM</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addButtonView}>
            <MyButton
              disabled={this.isAddDisabled()}
              disabledColor='#355973'
              color='#008ee0'
              textStyle={{ fontSize: 18 }}
              style={[styles.addButton, { marginBottom: 0 }]}
              onPress={() => {
                return this.props.addMoneyAccount(this.props.initialStackId, this.props.componentId, { name, status, amount: amount || 0 })
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
  formContainer: {
    flex: 1
  },
  checkBoxContainer: {
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 0,
    marginTop: 0,
    padding: 8,
    paddingLeft: 0
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
    addMoneyAccount: (initialStackId, componentId, { name, status, amount }) => (
      dispatch(addMoneyAccount(initialStackId, componentId, { name, status, amount }))
    )
  }
}

const mapStateToProps = ({ money }) => ({
  addingAccount: money.addingAccount
})

export default connect(mapStateToProps, mapDispatchToProps)(MoneyAddScreen)