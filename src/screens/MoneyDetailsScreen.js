import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  InteractionManager,
  Modal,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Linking,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import { addTransaction, deleteAccount } from '../actions'
import SpinnerSpinkit from 'react-native-spinkit'
import { Navigation } from 'react-native-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import TransactionCard from '../components/TransactionCard'

const { height, width } = Dimensions.get("window")

class MoneyDetailsScreen extends Component {
  constructor(props) {
    super(props)
    InteractionManager.runAfterInteractions(() => {
      this.setState({ canRender: true })
    })
    const { name, phone, accountId } = this.props
    this.accountId = accountId
    this.state = {
      canRender: false,
      name,
      phone,
      modalVisible: false,
      transConfirmationModalVisible: false,
      transType: '',
      transAmount: ''
    }
  }
  getName() {
    let name = this.props.name.split(' ')[0]
    let newName = ''
    for (let i = 0; i < name.length; i++)
      newName += this.props.name[i] + ' '
    return newName.toUpperCase().trim()
  }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  render() {
    return (
      this.state.canRender ?
        <View style={{
          ...styles.container,
          backgroundColor: this.useTheme('#fbfbfb', '#161616')
        }} >
          <View style={[StyleSheet.absoluteFill, {
            backgroundColor: this.state.transConfirmationModalVisible || this.state.modalVisible ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0)',
            zIndex: this.state.transConfirmationModalVisible || this.state.modalVisible ? 1 : 0
          }]}></View>
          <View style={{
            ...styles.header,
            backgroundColor: this.useTheme('#fbfbfb', '#161616')
          }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => Navigation.pop(this.props.componentId)}
              style={{
                ...styles.backIconContainer,
                backgroundColor: this.useTheme('#fbfbfb', '#161616')
              }}
            >
              <Ionicons name="md-arrow-back" size={26} color={this.useTheme('#303030', '#fbfbfb')} />
            </TouchableOpacity>
            <View style={{
              ...styles.titleContainer,
              backgroundColor: this.useTheme('#fbfbfb', '#161616')
            }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center', paddingRight: 7 }}
              >
                <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 25, fontFamily: 'SourceSansPro-SemiBold', textAlign: 'left' }}>
                  {this.props.name}
                </Text>
              </ScrollView>
            </View>
            <TouchableOpacity
              disabled={!this.props.phone}
              activeOpacity={0.85}
              onPress={() => Linking.openURL(`tel:${this.props.phone}`)}
              style={styles.callIconContainer}
            >
              <MaterialIcons
                name="perm-phone-msg"
                size={24}
                color={
                  this.props.phone ?
                    this.useTheme('#303030', '#fbfbfb')
                    :
                    this.useTheme('#888', '#888')
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                ...styles.editIconContainer,
                backgroundColor: this.useTheme('#fbfbfb', '#161616')
              }}
              onPress={() => Navigation.push(this.props.componentId, {
                component: {
                  name: 'moneyEdit',
                  passProps: {
                    accountId: this.props.accountId,
                    name: this.props.name,
                    phone: this.props.phone
                  }
                }
              })}
            >
              <MaterialIcons name="mode-edit" size={24} color={this.useTheme('#303030', '#fbfbfb')} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, paddingHorizontal: width / 32 }}>
            <View style={{
              ...styles.summaryContainer,
              backgroundColor: this.props.theme === 'light' ? '#f6f6f6' : '#242424',
              borderTopWidth: this.props.theme === 'light' ? 0.7 : 0,
              borderLeftWidth: this.props.theme === 'light' ? 1.05 : 0,
              borderWidth: this.props.theme === 'light' ? 1.05 : 0,
              borderBottomWidth: this.props.theme === 'light' ? 1.4 : 0,
              borderColor: this.props.theme === 'light' ? '#eee' : null
            }}>
              <View style={styles.firstInnerContainer}>
                <View style={{
                  ...styles.amountLabel,
                  backgroundColor: this.useTheme('rgba(0,0,0,0.03)', 'rgba(255,255,255,0.1)')
                }}>
                  <Text
                    ellipsizeMode={this.props.amount < 0 ? "tail" : "head"}
                    numberOfLines={1}
                    style={{
                      textAlign: 'left',
                      fontSize: 10,
                      fontFamily: 'SourceSansPro-Bold',
                      color: this.props.amount < 0 ?
                        this.useTheme('#cda2b1', '#cdacaf')
                        :
                        this.useTheme('#84989a', '#9cafba')
                    }}>
                    {
                      this.props.amount < 0 ?
                        `${'Y O U  S H O U L D  P A Y  T O  ' + this.getName()}`
                        :
                        `${this.getName() + '  S H O U L D  P A Y  F O R  Y O U'}`
                    }
                  </Text>
                </View>
              </View>
              <View style={styles.amountContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginHorizontal: 18 }}
                  contentContainerStyle={{ alignItems: 'center' }}
                >
                  <Text numberOfLines={1} style={{
                    ...styles.amountText,
                    borderWidth: 2,
                    borderColor: this.useTheme('#f6f6f6', '#242424'),
                    color: this.useTheme('#303030', '#fbfbfb')
                  }}>
                    {Math.abs(this.props.amount)}
                  </Text>
                </ScrollView>
              </View>
              <View style={styles.transNumberContainer}>
                <Text style={{ fontSize: 10.5, fontFamily: 'SourceSansPro-SemiBold', color: this.useTheme('#84989a', '#9cafba') }}>
                  T O T A L  T R A N S A C T I O N S :  {this.props.transactions.length}
                </Text>
              </View>
              <View style={{
                elevation: 1,
                ...styles.currencyContainer,
                backgroundColor: this.useTheme('#f6f6f6', '#242424'),
                borderColor: this.useTheme('#f6f6f6', '#1e1e1e'),
              }}>
                <FontAwesome5 name="coins" color="#ffb13d" size={20} />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.trashButtonContainer}
                onPress={() => this.setState({ modalVisible: true })}
              >
                <Octicons name="trashcan" size={23} color={this.useTheme('#84989a', 'rgba(156, 175, 186, 0.7)')} />
              </TouchableOpacity>
            </View>
            <View style={styles.transButtonsContainer}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.transButtons, {
                  backgroundColor: this.props.theme === 'light' ? '#f6f6f6' : '#242424',
                  borderTopWidth: this.props.theme === 'light' ? 0.7 : 0,
                  borderLeftWidth: this.props.theme === 'light' ? 1.05 : 0,
                  borderWidth: this.props.theme === 'light' ? 1.05 : 0,
                  borderBottomWidth: this.props.theme === 'light' ? 1.4 : 0,
                  borderColor: this.props.theme === 'light' ? '#eee' : null
                }]}
                onPress={() => {
                  this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
                  this.setState({ transConfirmationModalVisible: true, transType: 'send' })
                }}
              >
                <View style={[styles.arrowIconContainer, { backgroundColor: this.useTheme('#eaeaea', '#363536') }]}>
                  <FontAwesome name="arrow-up" color="#de3b5b" size={24} style={{ opacity: 0.75 }} />
                </View>
                <Text style={{ marginLeft: 8, fontFamily: 'SourceSansPro-Bold', color: this.useTheme('#303030', '#fbfbfb'), fontSize: 23 }}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.transButtons, {
                  backgroundColor: this.props.theme === 'light' ? '#f6f6f6' : '#242424',
                  borderTopWidth: this.props.theme === 'light' ? 0.7 : 0,
                  borderLeftWidth: this.props.theme === 'light' ? 1.05 : 0,
                  borderWidth: this.props.theme === 'light' ? 1.05 : 0,
                  borderBottomWidth: this.props.theme === 'light' ? 1.4 : 0,
                  borderColor: this.props.theme === 'light' ? '#eee' : null
                }]}
                onPress={() => {
                  this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
                  this.setState({ transConfirmationModalVisible: true, transType: 'receive' })
                }}
              >
                <View style={[styles.arrowIconContainer, { backgroundColor: this.useTheme('#eaeaea', '#2e3b47') }]}>
                  <FontAwesome name="arrow-down" color="#008ee0" size={24} style={{ opacity: 0.75 }} />
                </View>
                <Text style={{ marginLeft: 8, fontFamily: 'SourceSansPro-Bold', color: this.useTheme('#303030', '#fbfbfb'), fontSize: 23 }}>Receive</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.transTextContainer}>
              <Text style={{
                ...styles.transText,
                color: this.useTheme('#84989a', '#9cafba')
              }}>
                T R A N S A C T I O N S
              </Text>
            </View>
            <View style={styles.transListContainer}>
              <FlatList
                showsVerticalScrollIndicator={false}
                maxToRenderPerBatch={15}
                ref={ref => this.flatListRef = ref}
                contentContainerStyle={{ paddingBottom: 6 }}
                data={this.props.transactions}
                keyExtractor={transaction => transaction[0]}
                renderItem={({ item }) => <TransactionCard data={item} theme={this.props.theme} />}
                getItemLayout={(data, index) => ({ length: 81, offset: 81 * index, index })}
              />
            </View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => { this.setState({ modalVisible: false }) }}
            >
              <View style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: this.useTheme('rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)'),
              }}>
                <View style={{
                  ...styles.modal,
                  backgroundColor: this.useTheme('#fbfbfb', '#222')
                }}>
                  <View style={{
                    ...styles.upperModal,
                    backgroundColor: this.useTheme('#fbfbfb', '#222')
                  }}>
                    <Text style={{
                      fontFamily: 'SourceSansPro-SemiBold',
                      marginBottom: 7,
                      textAlign: 'center',
                      fontSize: 18,
                      color: this.useTheme('#303030', '#fbfbfb')
                    }}>
                      Delete this account?
                    </Text>
                    <Text style={{
                      fontFamily: 'SourceSansPro-SemiBold',
                      textAlign: 'center',
                      color: this.useTheme('#444', '#fbfbfb'),
                      fontSize: 16
                    }}>
                      This action cannot be undo.
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({ modalVisible: false });
                      }}
                      style={[
                        styles.modalButton,
                        {
                          borderBottomLeftRadius: 4,
                          backgroundColor: this.useTheme('#fbfbfb', '#222'),
                          borderTopColor: this.useTheme('#eaeaea', '#363636')
                        }]}>
                      <Text style={{ color: this.useTheme('#303030', '#eef'), fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({ modalVisible: false })
                        this.props.deleteAccount(this.props.componentId, this.accountId, this.props.accountData)
                      }}
                      style={[
                        styles.modalButton,
                        {
                          borderBottomRightRadius: 4,
                          backgroundColor: this.useTheme('#fbfbfb', '#222'),
                          borderTopColor: this.useTheme('#eaeaea', '#363636')
                        }]}>
                      <Text style={{ color: '#e65100', fontSize: 19, fontFamily: 'SourceSansPro-SemiBold' }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.transConfirmationModalVisible}
              onRequestClose={() => this.setState({ transConfirmationModalVisible: false })}
            >
              <View style={styles.transConfirmationModal}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.setState({ transConfirmationModalVisible: false, transAmount: '', transType: '' })}
                  style={{ flex: 1 }}
                ></TouchableOpacity>
                <View style={{
                  ...styles.innerTransConfirmationModal,
                  backgroundColor: this.useTheme('#fbfbfb', '#1a1a1a')
                }}>
                  <View style={styles.transInputContainer}>
                    <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-Bold', fontSize: 22, paddingRight: 7 }}>
                      {
                        this.state.transType === 'send' ?
                          "Sending to " + this.props.name + "..." :
                          "Receiving from " + this.props.name + "... "
                      }
                    </Text>
                    <View>
                      <TextInput
                        value={this.state.transAmount}
                        ref={ref => this.transInputRef = ref}
                        style={{
                          ...styles.amountInput,
                          color: this.useTheme('#303030', '#fbfbfb')
                        }}
                        placeholder="Specify the amount"
                        placeholderTextColor={this.useTheme('#999', 'rgba(255, 255, 255, 0.6)')}
                        keyboardType="decimal-pad"
                        onChangeText={transAmount => this.setState({ transAmount })}
                      />
                    </View>
                  </View>
                  <View style={styles.transConfirmationButtonsContainer}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.transButtons, {
                        backgroundColor: this.props.theme === 'light' ? '#f6f6f6' : '#242424',
                        borderTopWidth: this.props.theme === 'light' ? 0.7 : 0,
                        borderLeftWidth: this.props.theme === 'light' ? 1.05 : 0,
                        borderWidth: this.props.theme === 'light' ? 1.05 : 0,
                        borderBottomWidth: this.props.theme === 'light' ? 1.4 : 0,
                        borderColor: this.props.theme === 'light' ? '#eee' : null
                      }]}
                      onPress={() => {
                        this.setState({ transConfirmationModalVisible: false, transAmount: '', transType: '' })
                      }}
                    >
                      <Text style={{ marginLeft: 8, fontFamily: 'SourceSansPro-Bold', color: this.useTheme('#303030', '#fbfbfb'), fontSize: 22 }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.transButtons, {
                        backgroundColor: this.props.theme === 'light' ? '#f6f6f6' : '#242424',
                        borderTopWidth: this.props.theme === 'light' ? 0.7 : 0,
                        borderLeftWidth: this.props.theme === 'light' ? 1.05 : 0,
                        borderWidth: this.props.theme === 'light' ? 1.05 : 0,
                        borderBottomWidth: this.props.theme === 'light' ? 1.4 : 0,
                        borderColor: this.props.theme === 'light' ? '#eee' : null
                      }]}
                      onPress={() => {
                        if (!this.state.transAmount)
                          this.transInputRef.focus()
                        else {
                          this.props.addTransaction(
                            parseFloat(this.props.amount),
                            parseFloat(this.state.transAmount),
                            this.state.transType === 'send' ? 'Sent' : 'Received',
                            this.props.accountId
                          )
                          this.setState({ transConfirmationModalVisible: false, transAmount: '', transType: '' })
                        }
                      }}
                    >
                      <View style={[styles.arrowIconContainer, {
                        height: height / 24,
                        width: height / 24,
                        backgroundColor: this.state.transType === 'send' ?
                          this.useTheme('#eaeaea', '#363536')
                          :
                          this.useTheme('#eaeaea', '#2e3b47')
                      }]}>
                        <FontAwesome
                          name={this.state.transType === 'send' ? "arrow-up" : "arrow-down"}
                          color={this.state.transType === 'send' ? "#de3b5b" : "#008ee0"}
                          size={22}
                          style={{ opacity: 0.75 }}
                        />
                      </View>
                      <Text style={{
                        marginLeft: 8,
                        fontFamily: 'SourceSansPro-Bold',
                        color: this.useTheme('#303030', '#fbfbfb'),
                        fontSize: 22
                      }}>
                        {this.state.transType === 'send' ? "Send" : "Receive"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
        :
        <View style={{ flex: 1, backgroundColor: this.useTheme('#fbfbfb', '#303030'), alignItems: 'center', justifyContent: 'center' }}>
          <SpinnerSpinkit color="#008ee0" size={38} type="ThreeBounce" />
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
    paddingHorizontal: 4,
    flexDirection: 'row',
    marginBottom: 2,
    marginVertical:
      Dimensions.get('window').width > 800 ? 20
        :
        Dimensions.get('window').width > 700 ? 12
          :
          Dimensions.get('window').width > 600 ? 8
            :
            Dimensions.get('window').width > 500 ? 6
              :
              0
  },
  backIconContainer: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  editIconContainer: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  callIconContainer: {
    width: 48,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  summaryContainer: {
    height: height / 4.8,
    marginTop: height / 46,
    marginBottom: height / 36,
    borderRadius: 8,
    alignItems: 'center'
  },
  firstInnerContainer: {
    justifyContent: 'flex-end',
    height: height / 14
  },
  amountLabel: {
    paddingHorizontal: 10,
    maxWidth: width / 1.68,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  amountContainer: {
    justifyContent: 'center',
    height: height / 10
  },
  amountText: {
    fontSize: 50,
    fontFamily: 'SourceSansPro-Bold'
  },
  transNumberContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  trashButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  transButtonsContainer: {
    height: height / 14,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  transButtons: {
    width: '46%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  currencyContainer: {
    position: 'absolute',
    top: -21,
    height: 42,
    width: 42,

    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrowIconContainer: {
    height: height / 22,
    width: height / 22,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginRight: 8
  },
  transTextContainer: {
    height: height / 24,
    marginTop: height / 42,
    marginBottom: height / 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  transText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 10.8
  },
  transListContainer: {
    flex: 1
  },
  backButton: {
    marginRight: 15,
    alignItems: 'center',
    marginLeft: 5
  },
  transConfirmationModal: {
    flex: 1
  },
  innerTransConfirmationModal: {
    maxHeight: 300,
    height: height / 4,
    marginHorizontal: Dimensions.get('window').width > 800 ? 72
      :
      Dimensions.get('window').width > 700 ? 56
        :
        Dimensions.get('window').width > 600 ? 42
          :
          Dimensions.get('window').width > 500 ? 14
            :
            0,
    borderTopLeftRadius: height / 48,
    borderTopRightRadius: height / 48,
    paddingHorizontal: width / 28
  },
  transInputContainer: {
    justifyContent: 'space-evenly',
    height: height / 8,
    paddingTop: 4
  },
  transConfirmationButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height / 40,
    maxHeight: 110
  },
  amountInput: {
    backgroundColor: 'transparent',
    fontSize: 17,
    fontFamily: 'SourceSansPro-Regular',
    borderBottomWidth: 0.5,
    paddingBottom: 3,
    borderBottomColor: '#888'
  },
  modal: {
    width: 250,
    height: 135,
    alignSelf: 'center',
    borderRadius: 4
  },
  upperModal: {
    height: 90,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center'
  },
  modalButton: {
    height: 45,
    width: 125,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderTopColor: '#282828'
  }
})

const mapDispatchToProps = dispatch => ({
  addTransaction: (oldAmount, transAmount, status, accountId) => (
    dispatch(addTransaction(oldAmount, transAmount, status, accountId))
  ),
  deleteAccount: (componentId, accountId, accountData) => dispatch(deleteAccount(componentId, accountId, accountData))
})

const mapStateToProps = ({ money, app }, ownProps) => {
  let accountData, transactions, amount, name, phone
  if (money.allAccounts && money.allAccounts[ownProps.accountId]) {
    name = money.allAccounts[ownProps.accountId].name
    phone = money.allAccounts[ownProps.accountId].phone
    amount = money.allAccounts[ownProps.accountId].amount
    transactions = money.allAccounts[ownProps.accountId].transactions
    accountData = money.allAccounts[ownProps.accountId]
    transactions = Object.keys(transactions)
      .map(key => [key, transactions[key]])
      .sort((trans1, trans2) => trans2[1].date - trans1[1].date)
  }
  else {
    accountData = {}
    name = ''
    phone = ''
    amount = 0
    transactions = []
  }
  return {
    accountData,
    amount,
    name,
    phone,
    transactions,
    theme: app.theme
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoneyDetailsScreen)