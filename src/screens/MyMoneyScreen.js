import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { fetchAccounts, restoreLastDeletedAccount, changeAccountsSortData } from '../actions'
import { Icon } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MoneyCard from '../components/MoneyCard'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import SortChoicesModal from '../components/SortChoicesModal'
import AccountsLoadingContainer from '../components/AccountsLoadingContainer'

class MyMoneyScreen extends Component {
  constructor(props) {
    super(props)
    this.props.fetchAccounts()
    this.dataAppearsAtLeastOnce = false
    this.sortChoices = [
      { id: "2", prop: "default" },
      { id: "3", prop: "name" },
      { id: "4", prop: "amount - Low to High" },
      { id: "5", prop: "amount - High to Low" },
      { id: "6", prop: "last transaction - Oldest to Newest" },
      { id: "7", prop: "last transaction - Newest to Oldest" }
    ]
    this.activeSortLabel = ''
    this.state = { searchWord: '', sortChoicesModalVisible: false }
    this.hintOpacityValue = 0
    this.hintOpacity = new Animated.Value(0)
    this.hintOpacity.addListener(({ value }) => this.hintOpacityValue = value)
    this.hintTranslateY = this.hintOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [90, 0]
    })
    this.pAccountsOpacityValue = 0
    this.pAccountsOpacity = new Animated.Value(0)
    this.pAccountsOpacity.addListener(({ value }) => this.pAccountsOpacityValue = value)
    this.nAccountsOpacityValue = 0
    this.nAccountsOpacity = new Animated.Value(0)
    this.nAccountsOpacity.addListener(({ value }) => this.nAccountsOpacityValue = value)
    this.sortOpacity = this.hintOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })
  }
  componentWillUnmount() {
    this.hintOpacity.removeAllListeners()
    this.pAccountsOpacity.removeAllListeners()
    this.pAccountsOpacity.removeAllListeners()
  }
  changeSearchWord = (text) => {
    this.setState({ searchWord: text })
  }
  renderScreen() {
    if (!this.props.fetchingAccounts) {
      if (!this.props.allAccounts.length) {
        if (this.hintOpacityValue !== 1)
          Animated.timing(this.hintOpacity, {
            toValue: 1,
            duration: 375,
            useNativeDriver: true
          }).start()
        if (this.pAccountsOpacityValue !== 0)
          this.pAccountsOpacity.setValue(0)
        if (this.nAccountsOpacityValue !== 0)
          this.nAccountsOpacity.setValue(0)
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View style={{
              alignItems: 'center',
              translateY: this.hintTranslateY,
              opacity: this.hintOpacity,
              marginBottom: 140
            }}>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 2 }}>Do you have money with others</Text>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 5 }}>{''}and/or visversa?</Text>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-Regular', fontSize: 15 }}>Add accounts now and easily</Text>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-Regular', fontSize: 15, marginTop: 3 }}>{' '}manage all your transactions.</Text>
            </Animated.View>
          </View>
        )
      }
      if (!this.dataAppearsAtLeastOnce)
        this.dataAppearsAtLeastOnce = true
      if (this.hintOpacityValue !== 0)
        this.hintOpacity.setValue(0)
      let matchedAccounts
      if (this.state.searchWord === '')
        matchedAccounts = this.props.allAccounts
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
      if (this.props.sortBy === 'amount')
        nAccounts.reverse()
      if (!pAccounts.length && !nAccounts.length)
        return (
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 30 }}>
            <Text style={{ color: '#ddd', fontFamily: 'SourceSansPro-Regular', fontSize: 17, marginBottom: 2 }}>
              No matching accounts found!
            </Text>
          </View>
        )
      if (pAccounts.length && this.pAccountsOpacityValue !== 1)
        Animated.timing(this.pAccountsOpacity, {
          toValue: 1,
          duration: 175,
          useNativeDriver: true
        }).start()
      if (nAccounts.length && this.nAccountsOpacityValue !== 1)
        Animated.timing(this.nAccountsOpacity, {
          toValue: 1,
          duration: 175,
          useNativeDriver: true
        }).start()
      return (
        <ScrollView>
          <View style={{ paddingHorizontal: 5, paddingTop: 25 }}>
            {
              pAccounts.length ?
                <Animated.View style={{ marginBottom: 25, opacity: this.pAccountsOpacity }}>
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
                    getItemLayout={(data, index) => (
                      { length: 92, offset: 92 * index, index }
                    )}
                  />
                </Animated.View>
                :
                null
            }
            {
              nAccounts.length ?
                <Animated.View style={{ marginBottom: 15, opacity: this.nAccountsOpacity }}>
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
                    getItemLayout={(data, index) => (
                      { length: 92, offset: 92 * index, index }
                    )}
                  />
                </Animated.View>
                :
                null
            }
          </View>
        </ScrollView>
      )
    }
    return <AccountsLoadingContainer />
  }
  closeSortChoicesModal = () => {
    this.setState({ sortChoicesModalVisible: false })
  }
  onSelectSortChoice = choice => {
    this.setState({ sortChoicesModalVisible: false })
    switch (choice) {
      case 'default':
        this.props.changeAccountsSortData('default', 'asc')
        break
      case 'name':
        this.props.changeAccountsSortData('name', 'asc')
        break
      case 'amount - Low to High':
        this.props.changeAccountsSortData('amount', 'asc')
        break
      case 'amount - High to Low':
        this.props.changeAccountsSortData('amount', 'desc')
        break
      case 'last transaction - Oldest to Newest':
        this.props.changeAccountsSortData('lastTransaction', 'asc')
        break
      case 'last transaction - Newest to Oldest':
        this.props.changeAccountsSortData('lastTransaction', 'desc')
        break
    }
  }
  checkActiveSortLabel() {
    if (this.props.sortBy === 'default' && this.props.sortOrder === 'asc')
      this.activeSortLabel = 'default'
    if (this.props.sortBy === 'name' && this.props.sortOrder === 'asc')
      this.activeSortLabel = 'name'
    if (this.props.sortBy === 'amount' && this.props.sortOrder === 'asc')
      this.activeSortLabel = 'amount - Low to High'
    if (this.props.sortBy === 'amount' && this.props.sortOrder === 'desc')
      this.activeSortLabel = 'amount - High to Low'
    if (this.props.sortBy === 'lastTransaction' && this.props.sortOrder === 'asc')
      this.activeSortLabel = 'last transaction - Oldest to Newest'
    if (this.props.sortBy === 'lastTransaction' && this.props.sortOrder === 'desc')
      this.activeSortLabel = 'last transaction - Newest to Oldest'
  }
  renderSortButton() {
    if ((!this.props.fetchingAccounts && this.dataAppearsAtLeastOnce) || this.props.allAccounts.length)
      return (
        <Animated.View style={{ justifyContent: 'center', opacity: this.sortOpacity }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ width: 40, paddingLeft: 4, justifyContent: 'center' }}
            onPress={() => this.setState({ sortChoicesModalVisible: true })}
          >
            <MaterialCommunityIcons name="sort" color="#fff" size={28} />
          </TouchableOpacity>
        </Animated.View>
      )
    else
      return null
  }
  checkExit() {
    if (this.props.exitCount === 0)
      return null
    if (this.props.exitCount === 1) {
      return <View style={{
        borderRadius: 16,
        height: 38,
        width: 190,
        backgroundColor: '#555',
        position: 'absolute',
        bottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      }}>
        <Text style={{ fontSize: 15, color: '#ffffff', fontFamily: 'SourceSansPro-Regular' }}>Press again to exit...</Text>
      </View>
    }
  }
  renderUndoMessage() {
    return (
      <View style={[styles.undoView, {
        bottom: this.props.showUndoDelete ? 24.5 : -100
      }]}>
        <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'SourceSansPro-Regular' }}>1 deleted</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ alignItems: 'center', justifyContent: 'center', padding: 6, borderRadius: 6 }}
          onPress={() => {
            this.props.restoreLastDeletedAccount()
          }}
        >
          <Text style={{ fontSize: 17, fontFamily: 'SourceSansPro-SemiBold', color: '#008ee0' }}>
            Undo
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    { this.checkActiveSortLabel() }
    return (
      <View style={styles.container}>
        {this.renderUndoMessage()}
        {this.checkExit()}
        <SortChoicesModal
          choices={this.sortChoices}
          visible={this.state.sortChoicesModalVisible}
          selectedChoice={this.activeSortLabel}
          onSelect={this.onSelectSortChoice}
          onCancel={this.closeSortChoicesModal}
        />
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
              My Wallet
            </Text>
          </View>
          {this.renderSortButton()}
        </View>
        <View style={styles.searchView}>
          <Icon
            name='md-search'
            style={{ color: this.props.fetchingAccounts || !this.props.allAccounts.length ? '#777' : '#e3e3e3', fontSize: 26 }}
          />
          <TextInput
            editable={this.props.fetchingAccounts || !this.props.allAccounts.length ? false : true}
            value={this.state.searchWord}
            style={styles.input}
            placeholderTextColor='#777'
            placeholder='Search accounts'
            onChangeText={this.changeSearchWord}
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
      </View >
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
    paddingTop: 8,
    flexDirection: 'row',
    backgroundColor: '#000'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  undoView: {
    height: 46,
    left: 14,
    right: 88,
    zIndex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#272727',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 6
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
    paddingRight: 10,
    paddingLeft: 16,
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
    color: '#e3e3e3',
    alignItems: 'center',
    fontSize: 17,
    fontFamily: 'SourceSansPro-Regular',
    marginLeft: 8
  }
})

const mapDispatchToProp = dispatch => ({
  fetchAccounts: () => dispatch(fetchAccounts()),
  changeAccountsSortData: (sortBy, sortOrder) => dispatch(changeAccountsSortData(sortBy, sortOrder)),
  restoreLastDeletedAccount: () => dispatch(restoreLastDeletedAccount())
})

const mapStateToProps = ({ money, exit }) => {
  const { allAccounts: accounts, sortBy, sortOrder } = money
  let allAccounts
  if (accounts && sortBy && sortOrder) {
    if (sortBy === 'default')
      if (sortOrder === 'asc')
        allAccounts = Object.keys(accounts).map(key => [key, accounts[key]])
      else
        allAccounts = Object.keys(accounts).map(key => [key, accounts[key]]).reverse()
    if (sortBy === 'amount')
      if (sortOrder === 'asc')
        allAccounts = Object.keys(accounts).map(key => [key, accounts[key]]).sort((a, b) => a[1].amount - b[1].amount)
      else
        allAccounts = Object.keys(accounts).map(key => [key, accounts[key]]).sort((a, b) => b[1].amount - a[1].amount)
    if (sortBy === 'lastTransaction')
      if (sortOrder === 'asc')
        allAccounts = Object.keys(accounts).map(key => [key, accounts[key]]).sort((a, b) => a[1].lastTransaction - b[1].lastTransaction)
      else
        allAccounts = Object.keys(accounts).map(key => [key, accounts[key]]).sort((a, b) => b[1].lastTransaction - a[1].lastTransaction)
    if (sortBy === 'name')
      if (sortOrder === 'asc')
        allAccounts = Object.keys(accounts).map(key => [key, accounts[key]]).sort((a, b) => (a[1].name.toLowerCase() > b[1].name.toLowerCase()) ? 1 : ((b[1].name.toLowerCase() > a[1].name.toLowerCase()) ? -1 : 0))
      else
        allAccounts = Object.keys(accounts).map(key => [key, accounts[key]]).sort((a, b) => (a[1].name.toLowerCase() > b[1].name.toLowerCase()) ? -1 : ((b[1].name.toLowerCase() > a[1].name.toLowerCase()) ? 1 : 0))
  }
  else
    allAccounts = []
  return {
    allAccounts,
    sortBy,
    sortOrder,
    fetchingAccounts: money.fetchingAccounts,
    showUndoDelete: money.showUndoDelete,
    exitCount: exit.exitCount
  }
}

export default connect(mapStateToProps, mapDispatchToProp)(MyMoneyScreen)