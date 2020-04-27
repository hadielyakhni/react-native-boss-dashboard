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
import SortChoicesModal from '../components/ChoicesModal'
import AccountsLoadingContainer from '../components/AccountsLoadingContainer'
import { translate, isRTL } from '../utils/i18n'
import getNumber from '../utils/getNumber'

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
    this.state = { searchWord: '', sortChoicesModalVisible: false, isAddButtonDisabled: false, sortRequestedNow: false }
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
              transform: [{ translateY: this.hintTranslateY }],
              opacity: this.hintOpacity,
              marginBottom: 140
            }}>
              <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 2 }}>{translate('main.moneyList.hint1')}</Text>
              <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 5 }}>{''}{translate('main.moneyList.hint2')}</Text>
              <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-Regular', fontSize: 15 }}>{translate('main.moneyList.hint3')}</Text>
              <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-Regular', fontSize: 15, marginTop: 3 }}>{' '}{translate('main.moneyList.hint4')}</Text>
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
            <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-Regular', fontSize: 17, marginBottom: 2 }}>
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
                      <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 24, fontFamily: 'SourceSansPro-Bold' }}>
                        {translate('main.moneyList.iHave')}
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          flexGrow: 1,
                          paddingLeft: 10,
                          justifyContent: 'flex-end'
                        }}
                        style={{ marginLeft: 25, marginRight: 4 }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{ color: '#008ee0', fontSize: 24, fontFamily: 'SourceSansPro-Bold' }}
                        >
                          {getNumber(parseFloat(pTotal.toFixed(12)).toString()) + ' '}
                          <Text style={{ opacity: 0, fontSize: 0 }}>fff</Text>
                        </Text>
                      </ScrollView>
                      <View style={{ justifyContent: 'center' }}>
                        <FontAwesome5 name="coins" color="#008ee0" size={13} />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 10 }}>
                      <Text style={{ color: this.useTheme('#555', '#ddd'), fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>
                        {translate('main.moneyList.with')} {getNumber(pAccounts.length.toString())} {pAccounts.length === 1 ? translate('main.moneyList.person') : translate('main.moneyList.people')}
                      </Text>
                    </View>
                  </View>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ marginVertical: 5, borderRadius: 10 }}
                    data={pAccounts}
                    keyExtractor={account => account[0]}
                    renderItem={account => <MoneyCard
                      theme={this.props.theme}
                      componentId={this.props.componentId}
                      data={account.item}
                      sortRequestedNow={this.state.sortRequestedNow}
                    />}
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
                      <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 24, fontFamily: 'SourceSansPro-Bold' }}>
                        {translate('main.moneyList.iShouldPay')}
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          flexGrow: 1,
                          paddingLeft: 10,
                          justifyContent: 'flex-end'
                        }}
                        style={{ marginLeft: 25, marginRight: 4 }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{ color: '#de3b5b', fontSize: 24, fontFamily: 'SourceSansPro-Bold' }}
                        >
                          {getNumber(parseFloat(nTotal.toFixed(12)).toString()) + ' '}
                          <Text style={{ opacity: 0, fontSize: 0 }}>fff</Text>
                        </Text>
                      </ScrollView>
                      <View style={{ justifyContent: 'center', marginLeft: 2 }}>
                        <FontAwesome5 name="coins" color="#de3b5b" size={15} />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 10 }}>
                      <Text style={{ color: this.useTheme('#555', '#ddd'), fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>
                        {translate('main.moneyList.for')} {getNumber(nAccounts.length.toString())} {nAccounts.length === 1 ? translate('main.moneyList.person') : translate('main.moneyList.people')}
                      </Text>
                    </View>
                  </View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ marginVertical: 5, borderRadius: 10 }}
                    data={nAccounts}
                    keyExtractor={account => account[0]}
                    renderItem={account => <MoneyCard
                      theme={this.props.theme}
                      componentId={this.props.componentId}
                      data={account.item}
                      sortRequestedNow={this.state.sortRequestedNow}
                    />}
                    getItemLayout={(data, index) => (
                      { length: 92, offset: 92 * index, index }
                    )}
                  />
                </Animated.View>
                :
                null
            }
          </View>
        </ScrollView >
      )
    }
    return <AccountsLoadingContainer theme={this.props.theme} />
  }
  closeSortChoicesModal = () => {
    this.setState({ sortChoicesModalVisible: false })
  }
  onSelectSortChoice = choice => {
    this.setState({ sortChoicesModalVisible: false, sortRequestedNow: true })
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
    setTimeout(() => {
      this.setState({ sortRequestedNow: false })
    }, 500);
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
            disabled={this.hintOpacity === 1}
            style={{ width: 40, paddingHorizontal: 6, justifyContent: 'center' }}
            onPress={() => this.setState({ sortChoicesModalVisible: true })}
          >
            <MaterialCommunityIcons name="sort" color={this.useTheme('#303030', '#fbfbfb')} size={28} />
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
        paddingHorizontal: 20,
        borderRadius: 16,
        height: 38,
        backgroundColor: 'rgba(85, 85, 85, 0.85)',
        zIndex: 1,
        position: 'absolute',
        bottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      }}>
        <Text style={{ fontSize: 15, color: '#ffffff', fontFamily: 'SourceSansPro-Regular' }}>{translate('components.confirmExitModal.message')}</Text>
      </View>
    }
  }
  renderUndoMessage() {
    return (
      <View style={[styles.undoView, {
        bottom: this.props.showUndoDelete ? 24.5 : -100,
        backgroundColor: this.useTheme('#303030', '#f5f5f5')
      }]}>
        <Text style={{ fontSize: 15, color: this.useTheme('#fbfbfb', '#303030'), fontFamily: 'SourceSansPro-Regular' }}>1 {translate('components.undoModal.deleted')}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ alignItems: 'center', justifyContent: 'center', padding: 6, borderRadius: 6 }}
          onPress={() => {
            this.props.restoreLastDeletedAccount()
          }}
        >
          <Text style={{ fontSize: 17, fontFamily: 'SourceSansPro-SemiBold', color: '#008ee0' }}>
            {translate('components.undoModal.undo')}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  render() {
    this.checkActiveSortLabel()
    return (
      <View style={{
        ...styles.container,
        backgroundColor: this.useTheme('#f5f5f5', '#161616')
      }}>
        <View style={{ flex: 1 }}>
          {this.renderUndoMessage()}
          {this.checkExit()}
          <SortChoicesModal
            theme={this.props.theme}
            label="Sort By"
            choices={this.sortChoices}
            visible={this.state.sortChoicesModalVisible}
            selectedChoice={this.activeSortLabel}
            onSelect={this.onSelectSortChoice}
            onCancel={this.closeSortChoicesModal}
          />
          <View style={{
            ...styles.header,
            backgroundColor: this.useTheme('#f5f5f5', '#161616')
          }}>
            <View style={{
              ...styles.titleContainer,
              backgroundColor: this.useTheme('#f5f5f5', '#161616')
            }}>
              <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
                {translate('main.moneyList.title')}
              </Text>
            </View>
            {this.renderSortButton()}
          </View>
          <View style={{
            ...styles.searchView,
            backgroundColor: this.useTheme('#f9f9f9', '#242424')
          }}>
            <Icon
              name='md-search'
              style={{
                color: this.props.fetchingAccounts || !this.props.allAccounts.length ?
                  this.useTheme('#999', '#777')
                  :
                  this.useTheme('#606060', '#fbfbfb'),
                fontSize: 26
              }}
            />
            <TextInput
              editable={this.props.fetchingAccounts || !this.props.allAccounts.length ? false : true}
              value={this.state.searchWord}
              style={{
                ...styles.input,
                color: this.useTheme('#303030', '#fbfbfb'),
                textAlign: isRTL() ? 'right' : 'left'
              }}
              placeholderTextColor={this.useTheme('#999', 'rgba(255, 255, 255, 0.6)')}
              placeholder={translate('main.moneyList.placeholder')}
              onChangeText={this.changeSearchWord}
            />
          </View>
          {this.renderScreen()}
          <TouchableOpacity
            disabled={this.state.isAddButtonDisabled}
            activeOpacity={1}
            style={styles.addButton}
            onPress={() => {
              this.setState({ isAddButtonDisabled: true })
              setTimeout(() => {
                this.setState({ isAddButtonDisabled: false })
              }, 180);
              Navigation.push(this.props.componentId, {
                component: {
                  name: 'moneyAdd'
                }
              })
            }}
          >
            <Icon name='ios-add' style={{ color: '#f5f5f5', fontSize: 38 }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:
      Dimensions.get('window').width > 800 ? 62
        :
        Dimensions.get('window').width > 700 ? 48
          :
          Dimensions.get('window').width > 600 ? 36
            :
            Dimensions.get('window').width > 500 ? 10
              :
              0
  },
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical:
      Dimensions.get('window').width > 800 ? 20
        :
        Dimensions.get('window').width > 700 ? 12
          :
          Dimensions.get('window').width > 600 ? 8
            :
            Dimensions.get('window').width > 500 ? 6
              :
              2
  },
  titleContainer: {
    width: 300,
    paddingHorizontal: 12,
    justifyContent: 'center'
  },
  undoView: {
    height: 46,
    left: 14,
    right: 88,
    zIndex: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 6
  },
  addButton: {
    position: 'absolute',
    elevation: 4,
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
    marginHorizontal: 5,
    marginBottom: 2,
    marginTop: 10,
    paddingRight: 10,
    paddingLeft: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    elevation: 2
  },
  input: {
    borderRadius: 10,
    flex: 1,
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

const mapStateToProps = ({ money, app }) => {
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
    exitCount: app.exitCount,
    theme: app.theme
  }
}

export default connect(mapStateToProps, mapDispatchToProp)(MyMoneyScreen)