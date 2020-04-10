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
  render() {
    return (
      this.state.canRender ?
        <View style={styles.container} >
          <View style={[StyleSheet.absoluteFill, {
            backgroundColor: this.state.transConfirmationModalVisible || this.state.modalVisible ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0)',
            zIndex: this.state.transConfirmationModalVisible || this.state.modalVisible ? 1 : 0
          }]}></View>
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => Navigation.pop(this.props.componentId)}
              style={styles.backIconContainer}
            >
              <Ionicons name="md-arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center', paddingRight: 7 }}
              >
                <Text numberOfLines={1} style={{ color: '#fff', fontSize: 25, fontFamily: 'SourceSansPro-SemiBold', textAlign: 'left' }}>
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
              <MaterialIcons name="perm-phone-msg" size={24} color={this.props.phone ? '#fff' : '#888'} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.editIconContainer}
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
              <MaterialIcons name="mode-edit" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, paddingHorizontal: width / 22 }}>
            <View style={styles.summaryContainer}>
              <View style={styles.firstInnerContainer}>
                <View style={styles.amountLabel}>
                  <Text
                    ellipsizeMode={this.props.amount < 0 ? "tail" : "head"}
                    numberOfLines={1}
                    style={{ textAlign: 'left', fontSize: 10, fontFamily: 'SourceSansPro-Bold', color: this.props.amount < 0 ? '#cdacaf' : '#9cafba' }}>
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
                  <Text numberOfLines={1} style={{ ...styles.amountText, borderWidth: 2, borderColor: '#121212' }}>
                    {Math.abs(this.props.amount)}
                  </Text>
                </ScrollView>
              </View>
              <View style={styles.transNumberContainer}>
                <Text style={{ fontSize: 10.5, fontFamily: 'SourceSansPro-SemiBold', color: '#9cafba' }}>
                  T O T A L  T R A N S A C T I O N S :  {this.props.transactions.length}
                </Text>
              </View>
              <View style={styles.currencyContainer}>
                <FontAwesome5 name="coins" color="#ffb13d" size={20} />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.trashButtonContainer}
                onPress={() => this.setState({ modalVisible: true })}
              >
                <Octicons name="trashcan" size={23} color='rgba(156, 175, 186, 0.7)' />
              </TouchableOpacity>
            </View>
            <View style={styles.transButtonsContainer}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.transButtons, { backgroundColor: '#121212' }]}
                onPress={() => {
                  this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
                  this.setState({ transConfirmationModalVisible: true, transType: 'send' })
                }}
              >
                <View style={[styles.arrowIconContainer, { backgroundColor: '#34282d' }]}>
                  <FontAwesome name="arrow-up" color="#de3b5b" size={24} />
                </View>
                <Text style={{ marginLeft: 8, fontFamily: 'SourceSansPro-Bold', color: '#f7f7f7', fontSize: 23 }}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.transButtons, { backgroundColor: '#121212' }]}
                onPress={() => {
                  this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
                  this.setState({ transConfirmationModalVisible: true, transType: 'receive' })
                }}
              >
                <View style={[styles.arrowIconContainer, { backgroundColor: '#2e3b47' }]}>
                  <FontAwesome name="arrow-down" color="#008ee0" size={24} />
                </View>
                <Text style={{ marginLeft: 8, fontFamily: 'SourceSansPro-Bold', color: '#f7f7f7', fontSize: 23 }}>Receive</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.transTextContainer}>
              <Text style={styles.transText}>T R A N S A C T I O N S</Text>
            </View>
            <View style={styles.transListContainer}>
              <FlatList
                maxToRenderPerBatch={15}
                ref={ref => this.flatListRef = ref}
                contentContainerStyle={{ paddingBottom: 6 }}
                data={this.props.transactions}
                keyExtractor={transaction => transaction[0]}
                renderItem={({ item }) => <TransactionCard data={item} />}
                getItemLayout={(data, index) => ({ length: 81, offset: 81 * index, index })}
              />
            </View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => { this.setState({ modalVisible: false }) }}
            >
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={styles.modal}>
                  <View style={styles.upperModal}>
                    <Text style={{ fontFamily: 'SourceSansPro-Regular', marginBottom: 7, textAlign: 'center', color: '#eeeeee', fontSize: 18 }}>
                      Delete this account?
                    </Text>
                    <Text style={{ fontFamily: 'SourceSansPro-Regular', textAlign: 'center', color: '#eeeeee', fontSize: 18 }}>
                      This action cannot be undo.
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({ modalVisible: false });
                      }}
                      style={[styles.modalButton, { borderBottomLeftRadius: 4 }]}>
                      <Text style={{ color: '#eeeeee', fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({ modalVisible: false });
                        this.props.deleteAccount(this.props.componentId, this.accountId, this.props.accountData)
                      }}
                      style={[styles.modalButton, { borderBottomRightRadius: 4 }]}>
                      <Text style={{ color: '#e65100', fontSize: 18, fontFamily: 'SourceSansPro-SemiBold' }}>Delete</Text>
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
                <View style={styles.innerTransConfirmationModal}>
                  <View style={styles.transInputContainer}>
                    <Text numberOfLines={1} style={{ color: '#eee', fontFamily: 'SourceSansPro-Bold', fontSize: 22, paddingRight: 7 }}>
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
                        style={styles.amountInput}
                        placeholder="Specify the amount"
                        placeholderTextColor="#aaa"
                        keyboardType="decimal-pad"
                        onChangeText={transAmount => this.setState({ transAmount })}
                      />
                    </View>
                  </View>
                  <View style={styles.transConfirmationButtonsContainer}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.transButtons, { backgroundColor: '#171717' }]}
                      onPress={() => {
                        this.setState({ transConfirmationModalVisible: false, transAmount: '', transType: '' })
                      }}
                    >
                      <Text style={{ marginLeft: 8, fontFamily: 'SourceSansPro-Bold', color: '#fff', fontSize: 22 }}>
                        Cancel
                  </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[styles.transButtons, { backgroundColor: '#171717' }]}
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
                        backgroundColor: this.state.transType === 'send' ? '#34282d' : '#2e3b47'
                      }]}>
                        <FontAwesome
                          name={this.state.transType === 'send' ? "arrow-up" : "arrow-down"}
                          color={this.state.transType === 'send' ? "#de3b5b" : "#008ee0"}
                          size={22}
                        />
                      </View>
                      <Text style={{
                        marginLeft: 8,
                        fontFamily: 'SourceSansPro-Bold',
                        color: this.state.transType === 'send' ? '#de3b5b' : "#008ee0",
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
        <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
          <SpinnerSpinkit color="#008ee0" size={38} type="ThreeBounce" />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
              0,
    backgroundColor: '#000'
  },
  backIconContainer: {
    width: 42,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  editIconContainer: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  callIconContainer: {
    width: 48,
    marginLeft: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  summaryContainer: {
    height: height / 4.8,
    marginTop: height / 40,
    marginBottom: height / 36,
    backgroundColor: '#121212',
    borderRadius: 8,
    alignItems: 'center'
  },
  firstInnerContainer: {
    justifyContent: 'flex-end',
    height: height / 14
  },
  amountLabel: {
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
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
    color: '#ffffff',
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
    backgroundColor: '#121212',
    borderColor: '#000',
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
    color: '#9cafba',
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
  backIcon: {
    fontSize: 29,
    color: '#fff',
  },
  buttonView: {
    height: 150,
    justifyContent: 'space-evenly'
  },
  transConfirmationModal: {
    flex: 1
  },
  innerTransConfirmationModal: {
    height: height / 4,
    backgroundColor: '#232323',
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
    height: height / 8
  },
  transConfirmationButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: height / 40
  },
  amountInput: {
    backgroundColor: 'transparent',
    fontSize: 17,
    fontFamily: 'SourceSansPro-Regular',
    color: '#fff',
    borderBottomWidth: 0.5,
    paddingBottom: 3,
    borderBottomColor: '#888'
  },
  modal: {
    backgroundColor: '#171717',
    width: 250,
    height: 135,
    alignSelf: 'center',
    borderRadius: 4
  },
  upperModal: {
    height: 90,
    backgroundColor: '#171717',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center'
  },
  modalButton: {
    height: 45,
    width: 125,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 0.6,
    borderTopColor: '#282828'
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

const mapDispatchToProps = dispatch => ({
  addTransaction: (oldAmount, transAmount, status, accountId) => (
    dispatch(addTransaction(oldAmount, transAmount, status, accountId))
  ),
  deleteAccount: (componentId, accountId, accountData) => dispatch(deleteAccount(componentId, accountId, accountData))
})

const mapStateToProps = ({ money }, ownProps) => {
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
    transactions
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoneyDetailsScreen)