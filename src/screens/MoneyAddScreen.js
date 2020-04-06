import React, { Component } from 'react'
import { Text, StyleSheet, View, InteractionManager, ActivityIndicator, Modal, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { addMoneyAccount, resetAccount } from '../actions'
import { Spinner } from 'native-base'
import MyButton from '../components/MyButton'
import MyInput from '../components/MyInput'
import { CheckBox } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

class MoneyAddScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    InteractionManager.runAfterInteractions(() => {
      this.setState({ canRender: true, name: '', phone: '', amount: '', status: 'ME' })
    })
  }
  isAddDisabled() {
    const { name, amount } = this.state
    if (!name || !amount)
      return true
    return false
  }
  render() {
    const { name, phone, amount, status } = this.state
    return (
      this.state.canRender ?
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.85} onPress={() => Navigation.pop(this.props.componentId)} style={styles.backIconContainer}>
              <Ionicons name="md-arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={{ color: '#fff', fontSize: 25, fontFamily: 'SourceSansPro-SemiBold' }}>
                Add Account
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <View style={styles.formContainer}>
              <MyInput
                placeHolder="Name"
                leftIcon='ios-person'
                style={{ fontSize: 17, paddingRight: 15 }}
                inputContainerStyle={{ marginTop: 15 }}
                value={name}
                autoCapitalize="words"
                onChangeText={name => this.setState({ name })}
              />
              <MyInput
                placeHolder="How much money?"
                leftIcon='ios-cash'
                inputContainerStyle={{ marginTop: 10 }}
                style={{ fontSize: 17, paddingRight: 15 }}
                value={amount}
                keyboardType="decimal-pad"
                onChangeText={amount => this.setState({ amount })}
              />
              <MyInput
                keyboardType="number-pad"
                placeHolder="Phone number (optional)"
                inputContainerStyle={{ marginTop: 10 }}
                leftIcon='ios-call'
                style={{ fontSize: 17, paddingRight: 15 }}
                value={phone}
                onChangeText={phone => this.setState({ phone })}
              />
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState({ status: 'ME' })}
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, alignSelf: 'flex-start' }}>
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  uncheckedColor="#aaa"
                  checkedColor="#008ee0"
                  checked={status === 'ME'}
                  onPress={() => { this.setState({ status: 'ME' }) }}
                />
                <Text style={{ fontSize: 17, fontFamily: 'SourceSansPro-Bold', color: '#f7f7f7' }}>FOR ME</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.setState({ status: 'HIM' })}
                style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}
              >
                <CheckBox
                  containerStyle={styles.checkBoxContainer}
                  uncheckedColor='#aaa'
                  checkedColor='#de3b5b'
                  checked={status === 'HIM'}
                  onPress={() => { this.setState({ status: 'HIM' }) }}
                />
                <Text style={{ fontSize: 17, fontFamily: 'SourceSansPro-Bold', color: '#f7f7f7' }}>FOR HIM</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.addButtonView}>
              <MyButton
                disabled={this.isAddDisabled()}
                disabledColor='#355973'
                color='#008ee0'
                textStyle={{ fontSize: 20 }}
                style={[styles.addButton, { marginBottom: 0 }]}
                onPress={() => {
                  return this.props.addMoneyAccount(this.props.componentId, { name, phone, status, amount: amount || 0 })
                }}
              >Add</MyButton>
            </View>
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
    paddingHorizontal: 4
  },
  formContainer: {
    flex: 1
  },
  header: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#000',
    marginBottom: 10
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  backIconContainer: {
    width: 42,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkBoxContainer: {
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 0,
    marginTop: 0,
    padding: 8,
    paddingLeft: 0
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
    addMoneyAccount: (componentId, { name, phone, status, amount }) => (
      dispatch(addMoneyAccount(componentId, { name, phone, status, amount }))
    )
  }
}

export default connect(null, mapDispatchToProps)(MoneyAddScreen)