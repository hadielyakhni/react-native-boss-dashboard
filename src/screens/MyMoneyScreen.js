import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { fetchAccounts } from '../actions'
import { Icon } from 'native-base'
import Spinner from 'react-native-spinkit'
import MoneyCard from '../components/MoneyCard'

class MyMoneyScreen extends Component {
  constructor(props) {
    super(props)
    this.props.fetchAccounts()
    this.state = { searchWord: '' }
  }
  changeSearchWord = (text) => {
    this.setState({ searchWord: text })
  }
  renderScreen() {
    if (!this.props.fetchingAccounts) {
      let matchedAccounts
      if (this.state.searchWord === '') {
        matchedAccounts = this.props.allAccounts
      }
      else {
        let reg = RegExp(`${this.state.searchWord}`, 'i')
        matchedAccounts = this.props.allAccounts.filter(account => reg.test(account[1].name))
      }
      let pTotal = 0, nTotal = 0
      let pAccounts = matchedAccounts.filter(account => {
        const { status, amount1, amount2, amount3 } = account[1]
        if (status === 'ME')
          pTotal += (amount1 + amount2 + amount3)
        return status === 'ME'
      })
      let nAccounts = matchedAccounts.filter(account => {
        const { status, amount1, amount2, amount3 } = account[1]
        if (status === "HIM")
          nTotal += (amount1 + amount2 + amount3)
        return status === 'HIM'
      })
      return (
        <ScrollView>
          <View style={{ paddingHorizontal: 5, paddingTop: 25 }}>
            <View style={{ marginBottom: 40 }}>
              <View style={{ paddingHorizontal: 14, marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#fff', fontSize: 26, fontWeight: 'bold' }}>
                    YOU ARE OWED
                  </Text>
                  <Text style={{ color: '#008ee0', fontSize: 24, fontWeight: 'bold' }}>
                    ${pTotal}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <Icon name='md-person' style={{ color: '#0088e0', fontSize: 26, marginRight: 15 }} />
                  <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 18 }}>
                    by {pAccounts.length} people
                  </Text>
                </View>
              </View>
              <FlatList
                contentContainerStyle={{ marginVertical: 5, borderRadius: 10 }}
                data={pAccounts}
                keyExtractor={account => account[0]}
                renderItem={account => <MoneyCard componentId={this.props.componentId} data={account.item} />}
              />
            </View>
            <View style={{ marginBottom: 15 }}>
              <View style={{ paddingHorizontal: 14, marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#fff', fontSize: 26, fontWeight: 'bold' }}>
                    YOU OWE
                  </Text>
                  <Text style={{ color: '#ff006a', fontSize: 24, fontWeight: 'bold' }}>
                    $ -{nTotal}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <Icon name='md-person' style={{ color: '#ff006a', fontSize: 26, marginRight: 15 }} />
                  <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 18 }}>
                    to {nAccounts.length} people
                  </Text>
                </View>
              </View>
              <FlatList
                contentContainerStyle={{ marginVertical: 5, borderRadius: 10 }}
                data={nAccounts}
                keyExtractor={account => account[0]}
                renderItem={account => <MoneyCard componentId={this.props.componentId} data={account.item} />}
              />
            </View>
          </View>
        </ScrollView>
      )
    }
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
      }}>
        <Text style={{ fontSize: 14, color: '#464953' }}>L</Text>
        <Spinner type='Circle' size={24} color='#008ee0' />
        <Text style={{ fontSize: 14, color: '#464953' }}>ADING</Text>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchView}>
          <TextInput
            editable={this.props.fetchingAccounts ? false : true}
            value={this.state.searchWord}
            style={styles.input}
            placeholderTextColor='rgba(255, 255, 255, 0.6)'
            placeholder='Enter a name'
            onChangeText={this.changeSearchWord}
          />
          <Icon
            name='md-search'
            style={styles.searchIcon}
          />
        </View>
        {this.renderScreen()}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.addButton}
          onPress={() => {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'moneyAdd',
                options: {
                  topBar: { title: { text: 'Add Account' } }
                }
              }
            })
          }}
        >
          <Icon name='ios-add' style={{ color: '#fff', fontSize: 38 }} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 5
  },
  addButton: {
    position: 'absolute',
    right: 10,
    bottom: 20,
    backgroundColor: '#008ee0',
    height: 55,
    width: 55,
    borderRadius: 27.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchView: {
    marginBottom: 15,
    marginTop: 10,
    paddingRight: 15,
    paddingLeft: 5,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    height: 46
  },
  input: {
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    fontSize: 16,
    color: '#e3e3e3',
    alignItems: 'center'
  },
  searchIcon: {
    fontSize: 26,
    color: '#e3e3e3'
  }
})

const mapStateToProps = state => {
  const accounts = state.money.allAccounts
  let allAccounts
  if (accounts)
    allAccounts = Object.keys(accounts).map(key => [key, accounts[key]])
  else
    allAccounts = []
  return {
    allAccounts,
    fetchingAccounts: state.money.fetchingAccounts
  }
}

export default connect(mapStateToProps, { fetchAccounts })(MyMoneyScreen)