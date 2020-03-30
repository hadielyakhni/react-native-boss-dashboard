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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

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
        if (account[1].amount >= 0)
          pTotal += parseFloat(account[1].amount)
        return account[1].amount >= 0
      })
      let nAccounts = matchedAccounts.filter(account => {
        if (account[1].amount < 0)
          nTotal += parseFloat(-account[1].amount)
        return account[1].amount < 0
      })
      return (
        <ScrollView>
          <View style={{ paddingHorizontal: 5, paddingTop: 25 }}>
            <View style={{ marginBottom: 40 }}>
              <View style={{ paddingHorizontal: 14, marginBottom: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#fff', fontSize: 26, fontFamily: 'SourceSansPro-Bold' }}>
                    YOU ARE OWED
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    style={{ textAlign: 'right', marginLeft: 15, flex: 1, color: '#008ee0', fontSize: 27, fontFamily: 'SourceSansPro-Bold' }}
                  >
                    {pTotal + ' '}
                  </Text>
                  <View style={{ justifyContent: 'center', marginLeft: 2 }}>
                    <FontAwesome5 name="coins" color="#008ee0" size={15} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <Icon name='md-person' style={{ color: '#0088e0', fontSize: 24, marginRight: 12 }} />
                  <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 19, fontFamily: 'SourceSansPro-Regular' }}>
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
                  <Text style={{ color: '#fff', fontSize: 26, fontFamily: 'SourceSansPro-Bold' }}>
                    YOU OWE
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    style={{ textAlign: 'right', marginLeft: 15, flex: 1, color: '#de3b5b', fontSize: 27, fontFamily: 'SourceSansPro-Bold' }}
                  >
                    {nTotal + ' '}
                  </Text>
                  <View style={{ justifyContent: 'center', marginLeft: 2 }}>
                    <FontAwesome5 name="coins" color="#de3b5b" size={15} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <Icon name='md-person' style={{ color: '#de3b5b', fontSize: 24, marginRight: 15 }} />
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 19, fontFamily: 'SourceSansPro-Regular' }}>
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
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
              My Wallet
            </Text>
          </View>
        </View>
        <View style={styles.searchView}>
          <TextInput
            editable={this.props.fetchingAccounts ? false : true}
            value={this.state.searchWord}
            style={styles.input}
            placeholderTextColor='rgba(255, 255, 255, 0.7)'
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
                name: 'moneyAdd'
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
  header: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#000'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  addButton: {
    position: 'absolute',
    right: 14,
    bottom: 20,
    backgroundColor: '#008ee0',
    height: 55,
    width: 55,
    borderRadius: 27.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchView: {
    marginBottom: 2,
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
    color: '#e3e3e3',
    alignItems: 'center',
    fontSize: 17,
    fontFamily: 'SourceSansPro-Regular'
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