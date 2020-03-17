import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  InteractionManager,
  Modal,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { updateAccountInfo, deleteAccount } from '../actions'
import { Spinner } from 'native-base'
import AccountForm from '../components/AccountForm'
import MyButton from '../components/MyButton'

class MoneyDetailsScreen extends Component {
  constructor(props) {
    super(props)
    const { name, status, amount1, amount2, amount3 } = this.props.data[1]
    this.state = { canRender: false, name, status, amount1, amount2, amount3, modalVisible: false }
    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.uid = this.props.data[0]
        this.setState({ canRender: true })
      })
    }, 300);
  }
  updateState = (prop, value) => {
    this.setState({ [prop]: value })
  }
  render() {
    return (
      this.state.canRender ?
        <View style={styles.container}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({ modalVisible: false })
            }}>
            <View
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'center' }}
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
                      this.props.deleteAccount(this.props.componentId, { uid: this.uid })
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
            <View style={[styles.loadingModalContainer]} >
              <View style={styles.loadingModal}>
                <Spinner color='#eeeeee' size={27} style={{ marginRight: 0 }} />
                <Text style={{ color: '#eeeeee', fontSize: 15 }}>Deleting...</Text>
              </View>
            </View>
          </Modal>
          <AccountForm
            data={{
              name: this.state.name,
              status: this.state.status,
              amount1: this.state.amount1,
              amount2: this.state.amount2,
              amount3: this.state.amount3
            }}
            updateInputs={this.updateState}
            nameViewStyle={{ paddingTop: 0, paddingBottom: 22 }}
            sliderStyle={{ marginTop: 5, marginBottom: 28 }}
          />
          <View style={styles.buttonView}>
            <MyButton
              activeOpacity={0.9}
              style={{ height: 55 }}
              textStyle={{ fontSize: 20 }}
              color='#008ee0'
              onPress={() => {
                const { name, status, amount, amount1, amount2, amount3 } = this.state
                this.props.updateAccountInfo(this.props.componentId, { name, status, amount, amount1, amount2, amount3, uid: this.uid })
              }}
            >Save</MyButton>
            <MyButton
              activeOpacity={0.9}
              style={{ marginBottom: 20, height: 50 }}
              color='#e65100'
              textStyle={{ fontSize: 20 }}
              onPress={() => this.setState({ modalVisible: true })}
            >Delete</MyButton>
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
    paddingTop: 18
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
  updateAccountInfo: (componentId, { name, status, amount, amount1, amount2, amount3, uid }) => (
    dispatch(updateAccountInfo(componentId, { name, status, amount, amount1, amount2, amount3, uid }))
  ),
  deleteAccount: (componentId, { uid }) => dispatch(deleteAccount(componentId, { uid }))
})

const mapStateToProps = state => ({
  deletingAccount: state.money.deletingAccount,
  updatingAccount: state.money.updatingAccount
})

export default connect(mapStateToProps, mapDispatchToProps)(MoneyDetailsScreen)