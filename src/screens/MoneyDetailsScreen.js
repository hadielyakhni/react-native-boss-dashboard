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
  UIManager,
  LayoutAnimation,
  FlatList,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { addTransaction, deleteAccount } from '../actions'
import { Spinner } from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import TransactionCard from '../components/TransactionCard'

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

const { height, width } = Dimensions.get("window")

class MoneyDetailsScreen extends Component {
  constructor(props) {
    super(props)
    const { name, accountId } = this.props
    this.accountId = accountId
    this.state = {
      canRender: false,
      name,
      modalVisible: false,
      transConfirmationModalVisible: false,
      transType: '',
      transAmount: ''
    }
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.setState({ canRender: true })
      })
    }, 225);
  }
  componentDidUpdate() {
    LayoutAnimation.configureNext({
      duration: 200,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY
      }
    })
  }
  render() {
    return (
      this.state.canRender ?
        <View style={styles.container}>
          <View style={[StyleSheet.absoluteFill, {
            backgroundColor: this.state.transConfirmationModalVisible || this.state.modalVisible ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0)',
            zIndex: this.state.transConfirmationModalVisible || this.state.modalVisible ? 1 : 0
          }]}></View>
          <View style={styles.summaryContainer}>
            <View style={styles.amountLabel}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#9cafba' }}>
                Y O U R  B A L A N C E
            </Text>
            </View>
            <View style={styles.amountContainer}>
              <Text numberOfLines={1} ellipsizeMode="middle" style={styles.amountText}>
                {this.props.amount}
              </Text>
            </View>
            <View style={styles.transNumberContainer}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#9cafba' }}>
                T O T A L  T R A N S A C T I O N S :  {this.props.transactions.length}
              </Text>
            </View>
            <View style={styles.currencyContainer}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 36, transform: [{ rotate: '-10deg' }] }}>
                $
            </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.trashButtonContainer}
              onPress={() => this.setState({ modalVisible: true })}
            >
              <FontAwesome name="trash" color="rgba(156, 175, 186, 0.5)" size={25} />
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
              <Text style={{ marginLeft: 8, fontWeight: 'bold', color: '#fff', fontSize: 20 }}>Send</Text>
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
              <Text style={{ marginLeft: 8, fontWeight: 'bold', color: '#fff', fontSize: 20 }}>Receive</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.transTextContainer}>
            <Text style={styles.transText}>T R A N S A C T I O N S</Text>
          </View>
          <View style={styles.transListContainer}>
            <FlatList
              ref={ref => this.flatListRef = ref}
              contentContainerStyle={{ paddingBottom: 6 }}
              data={this.props.transactions}
              keyExtractor={transaction => transaction[0]}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({ modalVisible: false })
            }}>
            <View
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <View style={styles.modal}>
                <View style={styles.upperModal}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 7, textAlign: 'center', color: '#eeeeee', fontSize: 17 }}>
                    Delete this account?
                  </Text>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center', color: '#eeeeee', fontSize: 15 }}>
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
                    <Text style={{ color: '#eeeeee', fontSize: 18, fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      this.setState({ modalVisible: false });
                      this.props.deleteAccount(this.props.componentId, this.accountId)
                    }}
                    style={[styles.modalButton, { borderBottomRightRadius: 4 }]}>
                    <Text style={{ color: '#e65100', fontSize: 18, fontWeight: 'bold' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.updatingAccount}>
            <View style={styles.loadingModalContainer} >
              <View style={styles.loadingModal}>
                <Spinner color='#eeeeee' size={27} style={{ marginRight: 0 }} />
                <Text style={{ color: '#eeeeee', fontSize: 15 }}>Updating...</Text>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.deletingAccount}>
            <View style={styles.loadingModalContainer} >
              <View style={styles.loadingModal}>
                <Spinner color='#eeeeee' size={27} style={{ marginRight: 0 }} />
                <Text style={{ color: '#eeeeee', fontSize: 15 }}>Deleting...</Text>
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
              <View style={styles.innerTransConfirmationModal}>
                <View style={styles.transInputContainer}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
                    {
                      this.state.transType === 'send' ?
                        "Sending to " + this.props.name + "..." :
                        "Receiving from " + this.props.name + "... "
                    }
                  </Text>
                  <View>
                    <TextInput
                      value={this.state.transAmount}
                      style={styles.amountInput}
                      placeholder="Specify the amount $"
                      placeholderTextColor="#888"
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
                      this.setState({ transConfirmationModalVisible: false, transType: '' })
                    }}
                  >
                    <Text style={{ marginLeft: 8, fontWeight: 'bold', color: '#fff', fontSize: 20 }}>
                      Cancel
                  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[styles.transButtons, { backgroundColor: '#171717' }]}
                    onPress={() => {
                      this.props.addTransaction(
                        parseFloat(this.props.amount),
                        parseFloat(this.state.transAmount),
                        this.state.transType === 'send' ? 'Sent' : 'Received',
                        this.props.accountId
                      )
                      this.setState({ transConfirmationModalVisible: false, transAmount: '', transType: '' })
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
                      fontWeight: 'bold',
                      color: this.state.transType === 'send' ? '#de3b5b' : "#008ee0",
                      fontSize: 20
                    }}>
                      {this.state.transType === 'send' ? "Send" : "Receive"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    paddingHorizontal: width / 22
  },
  summaryContainer: {
    height: height / 4.8,
    marginTop: height / 36,
    paddingTop: height / 28,
    marginBottom: height / 36,
    backgroundColor: '#121212',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  amountLabel: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 110,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  amountContainer: {
    marginTop: height / 100,
    marginBottom: height / 60
  },
  amountText: {
    paddingHorizontal: width / 10,
    color: '#ffffff',
    fontSize: 42,
    fontWeight: 'bold'
  },
  trashButtonContainer: {
    position: 'absolute',
    top: 13,
    right: 13,
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
    width: ((width - width / 11) / 2) - width / 26,
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
    backgroundColor: '#fd9517',
    borderRadius: 14,
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
    color: '#9cafba',
    fontSize: 10.5
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
    flex: 1,
    justifyContent: 'flex-end'
  },
  innerTransConfirmationModal: {
    height: height / 4,
    backgroundColor: '#232323',
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
    fontSize: 16,
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
  deleteAccount: (componentId, accountId) => dispatch(deleteAccount(componentId, accountId))
})

const mapStateToProps = ({ money }, ownProps) => {
  let transactions, amount
  if (money.allAccounts && money.allAccounts[ownProps.accountId]) {
    amount = money.allAccounts[ownProps.accountId].amount
    transactions = money.allAccounts[ownProps.accountId].transactions
    transactions = Object.keys(transactions)
      .map(key => [key, transactions[key]])
      .sort((trans1, trans2) => trans2[1].date - trans1[1].date)
  }
  else {
    amount = 0
    transactions = []
  }
  return {
    amount,
    transactions,
    deletingAccount: money.deletingAccount,
    updatingAccount: money.updatingAccount
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoneyDetailsScreen)