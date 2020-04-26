import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Linking, Modal, Dimensions, ScrollView, NativeModules } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from '@react-native-community/google-signin'
import AsyncStorage from '@react-native-community/async-storage'
import { Navigation } from 'react-native-navigation'
import { goToAuth } from '../navigation/navigation'
import { connect } from 'react-redux'
import { incrementExitCount, resetExitCount, setTheme } from '../actions'
import { Spinner } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import ChoicesModal from '../components/ChoicesModal'
import { translate, getUsedLanguage, isRTL, isUsedLanguageSystem } from '../utils/i18n'

const NativeSplashScreen = NativeModules.NativeSplashScreen

class SettingsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      loggingout: false,
      themeChoicesModalVisible: false,
      languageChoicesModalVisible: false,
      providers: [],
      isChangePasswordButtonDisabled: false
    }
    this.themeChoices = [{ id: '1', prop: 'system' }, { id: "2", prop: 'light' }, { id: '3', prop: 'dark' }]
    this.languageChoices = [{ id: '1', prop: 'system' }, { id: '2', prop: 'english' }, { id: '3', prop: 'french' }, { id: '4', prop: 'arabic' }]
    const storedData = ['uid', 'email', 'providers']
    AsyncStorage.multiGet(storedData).then(data => {
      this.setState({
        uid: data[0][1],
        email: data[1][1],
        providers: JSON.parse(data[2][1])
      })
    })
  }
  checkExit() {
    if (this.props.exitCount === 0)
      return null
    if (this.props.exitCount === 1) {
      return <View style={{
        opacity: 0.9,
        paddingHorizontal: 20,
        borderRadius: 16,
        height: 38,
        backgroundColor: '#555',
        position: 'absolute',
        zIndex: 1,
        bottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      }}>
        <Text style={{ fontSize: 15, color: '#ffffff', fontFamily: 'SourceSansPro-Regular' }}>{translate('components.confirmExitModal.message')}</Text>
      </View>
    }
    else if (this.props.exitCount === 2)
      BackHandler.exitApp()
  }
  closeThemeChoicesModal = () => {
    this.setState({ themeChoicesModalVisible: false })
  }
  closeLanguageChoicesModal = () => {
    this.setState({ languageChoicesModalVisible: false })
  }
  onSelectThemeChoice = async choice => {
    if (choice === 'system' && this.props.isSystemTheme) {
      this.setState({ themeChoicesModalVisible: false })
      return
    }
    if (choice === 'light' && this.props.theme === 'light' && !this.props.isSystemTheme) {
      this.setState({ themeChoicesModalVisible: false })
      return
    }
    if (choice === 'dark' && this.props.theme === 'dark' && !this.props.isSystemTheme) {
      this.setState({ themeChoicesModalVisible: false })
      return
    }
    if (choice === 'light' && this.props.theme === 'light' && this.props.isSystemTheme) {
      AsyncStorage.setItem('theme', choice)
      this.props.setTheme('light')
      this.setState({ themeChoicesModalVisible: false })
      return
    }
    if (choice === 'dark' && this.props.theme === 'dark' && this.props.isSystemTheme) {
      AsyncStorage.setItem('theme', choice)
      this.props.setTheme('dark')
      this.setState({ themeChoicesModalVisible: false })
      return
    }
    if (choice === 'dark')
      Navigation.setDefaultOptions({ statusBar: { backgroundColor: '#161616' } })
    await AsyncStorage.setItem('theme', choice)
    this.setState({ themeChoicesModalVisible: false })
    NativeSplashScreen.show()
    Navigation.setRoot({
      root: {
        component: {
          name: 'first',
          options: {
            animations: {
              setRoot: {
                waitForRender: true
              }
            }
          }
        }
      }
    })
  }
  onSelectLanguageChoice = async choice => {
    if (choice === 'system') {
      AsyncStorage.removeItem('language')
      AsyncStorage.removeItem('isRTL')
    }
    else if (choice === 'english') {
      await AsyncStorage.multiSet([['language', 'en'], ['isRTL', 'false']])
    }
    else if (choice === 'french') {
      await AsyncStorage.multiSet([['language', 'fr'], ['isRTL', 'false']])
    }
    else if (choice === 'arabic') {
      await AsyncStorage.multiSet([['language', 'ar'], ['isRTL', 'true']])
    }
    this.setState({ languageChoicesModalVisible: false })
    if (choice !== getUsedLanguage()) {
      NativeSplashScreen.show()
      Navigation.setRoot({
        root: {
          component: {
            name: 'first',
            options: {
              animations: {
                setRoot: {
                  waitForRender: true
                }
              }
            }
          }
        }
      })
    }
  }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  render() {
    return (
      <View style={{
        ...styles.container,
        backgroundColor: this.useTheme('#f5f5f5', '#161616')
      }}>
        <ChoicesModal
          theme={this.props.theme}
          label="Theme"
          choices={this.themeChoices}
          visible={this.state.themeChoicesModalVisible}
          selectedChoice={this.props.isSystemTheme ? 'system' : this.props.theme}
          onSelect={this.onSelectThemeChoice}
          onCancel={this.closeThemeChoicesModal}
        />
        <ChoicesModal
          theme={this.props.theme}
          label="Language"
          choices={this.languageChoices}
          visible={this.state.languageChoicesModalVisible}
          selectedChoice={isUsedLanguageSystem() ? 'system' : getUsedLanguage()}
          onSelect={this.onSelectLanguageChoice}
          onCancel={this.closeLanguageChoicesModal}
        />
        {this.checkExit()}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.setState({ modalVisible: false })
              }}
              style={[StyleSheet.absoluteFill, {
                backgroundColor: this.props.theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)',
                zIndex: 0
              }]}></TouchableOpacity>
            <View style={{
              ...styles.modal,
              backgroundColor: this.useTheme('#fbfbfb', '#222')
            }}>
              <View style={{
                ...styles.upperModal,
                backgroundColor: this.useTheme('#fbfbfb', '#222')
              }}>
                <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>
                  {translate('components.logOutModal.message')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: false, loggingout: true })
                  LoginManager.logOut()
                  GoogleSignin.signOut()
                  AsyncStorage.removeItem('uid')
                  AsyncStorage.removeItem('email')
                  AsyncStorage.removeItem('providers')
                  this.props.resetTasks()
                  this.props.resetEmployees()
                  this.props.resetAccounts()
                  setTimeout(() => {
                    goToAuth()
                  }, 750);
                }}
                activeOpacity={0.6}
                style={{
                  ...styles.centerModal,
                  backgroundColor: this.useTheme('#fbfbfb', '#222'),
                  borderColor: this.useTheme('#ddd', '#282828')
                }}
              >
                <Text style={{ color: '#008ee0', fontSize: 18, fontFamily: 'SourceSansPro-SemiBold' }}>
                  {translate('components.logOutModal.logout')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ modalVisible: false })}
                activeOpacity={0.6}
                style={{
                  ...styles.lowerModal,
                  backgroundColor: this.useTheme('#fbfbfb', '#222')
                }}
              >
                <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 18, fontFamily: 'SourceSansPro-Regular' }}>
                  {translate('components.logOutModal.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.loggingout}
        >
          <View style={{
            ...styles.loadingModalContainer,
            backgroundColor: this.useTheme('rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)')
          }} >
            <View style={{
              ...styles.loadingModal,
              backgroundColor: this.useTheme('#fbfbfb', '#222')
            }}>
              <Spinner color={this.useTheme('#303030', '#fbfbfb')} size={26} style={{ marginHorizontal: 15 }} />
              <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 17, fontFamily: 'SourceSansPro-Regular' }}>
                {translate('components.loggingOutModal.message') + "   "}
              </Text>
            </View>
          </View>
        </Modal>
        <View style={{
          ...styles.header,
          backgroundColor: this.useTheme('#f5f5f5', '#161616')
        }}>
          <View style={{
            ...styles.titleContainer,
            backgroundColor: this.useTheme('#f5f5f5', '#161616')
          }}>
            <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
              {translate('main.settings.title')}
            </Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            disabled={this.state.isChangePasswordButtonDisabled}
            activeOpacity={(this.state.providers.includes('password')) ? 0.9 : 1}
            onPress={() => {
              this.setState({ isChangePasswordButtonDisabled: true })
              setTimeout(() => {
                this.setState({ isChangePasswordButtonDisabled: false })
              }, 180);
              if (this.state.providers.includes('password'))
                Navigation.push(this.props.componentId, {
                  component: {
                    name: 'forgetPassword',
                    passProps: {
                      email: this.state.email
                    }
                  }
                })
            }}
          >
            <View style={{
              backgroundColor: this.useTheme('#f5f5f5', '#161616'),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <View style={{ height: 56, flexDirection: 'row', alignItems: 'center' }}>
                {this.state.providers.includes('password') &&
                  < MaterialIcons
                    name="email"
                    color={this.useTheme('#303030', '#fbfbfb')}
                    size={24.5}
                    style={{
                      marginHorizontal: this.state.providers.includes('google.com') ? 12 : 15
                    }}
                  />
                }
                {this.state.providers.includes('facebook.com') &&
                  <FontAwesome name="facebook-square" color="#1d9de2" size={24.5} style={{ marginHorizontal: 15 }} />
                }
                {this.state.providers.includes('google.com') &&
                  <FontAwesome
                    name="google"
                    color="#E53935"
                    size={24}
                    style={{
                      marginLeft: this.state.providers.includes('password') ? 0 : 15,
                      marginRight: 15
                    }} />
                }
                <Text
                  numberOfLines={1}
                  ellipsizeMode="middle"
                  style={{
                    width: Dimensions.get('window').width - 125,
                    textAlign: 'left',
                    color: this.useTheme('#303030', '#fbfbfb'),
                    fontSize: 19,
                    fontFamily: 'SourceSansPro-SemiBold'
                  }}
                >
                  {this.state.email}
                </Text>
              </View>
              {
                this.state.providers.includes('password') &&
                <View style={{ marginRight: 15 }}>
                  <MaterialIcons name={isRTL() ? "chevron-left" : "chevron-right"} color={this.useTheme('#303030', '#fbfbfb')} size={30} />
                </View>
              }
            </View>
          </TouchableOpacity>
          <Text style={{
            marginLeft: 10,
            marginBottom: 6,
            marginTop: 24,
            color: this.useTheme('#303030', '#707070'),
            fontSize: 16,
            fontFamily: 'SourceSansPro-Regular'
          }}>
            {translate('main.settings.settings')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState({ languageChoicesModalVisible: true })}
          >
            <View style={{
              backgroundColor: this.useTheme('#f5f5f5', '#161616'),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <Entypo name="language" color={this.useTheme('#303030', '#fbfbfb')} size={24.5} />
                <Text style={{ marginLeft: 20, color: this.useTheme('#303030', '#fbfbfb'), fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  {translate('main.settings.language')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <Text style={{ color: this.useTheme('#666', '#999'), fontSize: 17, fontFamily: 'SourceSansPro-Regular', marginRight: 10 }}>
                  {isUsedLanguageSystem() ? translate('components.choicesModal.languagesModal.options.system') + ' - ' : null}
                  {translate('components.choicesModal.languagesModal.options.' + getUsedLanguage())}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => this.setState({ themeChoicesModalVisible: true })}
          >
            <View style={{
              backgroundColor: this.useTheme('#f5f5f5', '#161616'),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons name="theme-light-dark" color={this.useTheme('#303030', '#fbfbfb')} size={24.5} />
                <Text style={{ marginLeft: 20, color: this.useTheme('#303030', '#fbfbfb'), fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  {translate('main.settings.theme')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <Text style={{ color: this.useTheme('#666', '#999'), fontSize: 17, fontFamily: 'SourceSansPro-Regular', marginRight: 10 }}>
                  {
                    this.props.isSystemTheme ?
                      translate('components.choicesModal.themesModal.options.system') + ' - ' + translate('components.choicesModal.themesModal.options.' + this.props.theme)
                      :
                      translate('components.choicesModal.themesModal.options.' + this.props.theme)
                  }
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={{
            marginLeft: 10,
            marginBottom: 6,
            marginTop: 24,
            color: this.useTheme('#303030', '#707070'),
            fontSize: 16,
            fontFamily: 'SourceSansPro-Regular'
          }}>
            {translate('main.settings.developer')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => Linking.openURL(`mailto:boss.dashboard@gmail.com`)}
          >
            <View style={{
              backgroundColor: this.useTheme('#f5f5f5', '#161616'),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons name="help-circle-outline" color={this.useTheme('#303030', '#fbfbfb')} size={25} />
                <Text style={{ marginLeft: 20, color: this.useTheme('#303030', '#fbfbfb'), fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  {translate('main.settings.helpCenter')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <View style={{ marginHorizontal: 7 }}>
                  <MaterialIcons name={isRTL() ? "chevron-left" : "chevron-right"} color={this.useTheme('#666', '#999')} size={30} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
          >
            <View style={{
              backgroundColor: this.useTheme('#f5f5f5', '#161616'),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons name="message-text" color={this.useTheme('#303030', '#fbfbfb')} size={24.5} />
                <Text style={{ marginLeft: 20, color: this.useTheme('#303030', '#fbfbfb'), fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  {translate('main.settings.feedback')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <View style={{ marginHorizontal: 7 }}>
                  <MaterialIcons name={isRTL() ? "chevron-left" : "chevron-right"} color={this.useTheme('#666', '#999')} size={30} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
          >
            <View style={{
              backgroundColor: this.useTheme('#f5f5f5', '#161616'),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons name="coffee-outline" color={this.useTheme('#303030', '#fbfbfb')} size={25} />
                <Text style={{ marginLeft: 20, color: this.useTheme('#303030', '#fbfbfb'), fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  {translate('main.settings.buyMeACoffee')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <View style={{ marginHorizontal: 7 }}>
                  <MaterialIcons name={isRTL() ? "chevron-left" : "chevron-right"} color={this.useTheme('#666', '#999')} size={30} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <Text style={{
            marginLeft: 10,
            marginBottom: 6,
            marginTop: 24,
            color: this.useTheme('#303030', '#707070'),
            fontSize: 16,
            fontFamily: 'SourceSansPro-Regular'
          }}>
            {translate('main.settings.privacy')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.9}
          >
            <View style={{
              backgroundColor: this.useTheme('#f5f5f5', '#161616'),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <MaterialCommunityIcons name="lock-outline" color={this.useTheme('#303030', '#fbfbfb')} size={25} />
                <Text style={{ marginLeft: 20, color: this.useTheme('#303030', '#fbfbfb'), fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  {translate('main.settings.privacyPolicy')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <View style={{ marginHorizontal: 7 }}>
                  <MaterialIcons name={isRTL() ? "chevron-left" : "chevron-right"} color={this.useTheme('#666', '#999')} size={30} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
          >
            <View style={{
              backgroundColor: this.useTheme('#f5f5f5', '#161616'),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <View style={{ height: 56, flexDirection: 'row', paddingLeft: 15, alignItems: 'center' }}>
                <Ionicons name="md-paper" color={this.useTheme('#303030', '#fbfbfb')} size={24} />
                <Text style={{ marginLeft: 20, color: this.useTheme('#303030', '#fbfbfb'), fontSize: 19.5, fontFamily: 'SourceSansPro-SemiBold' }}>
                  {translate('main.settings.termsOfUse')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 7 }}>
                <View style={{ marginHorizontal: 7 }}>
                  <MaterialIcons name={isRTL() ? "chevron-left" : "chevron-right"} color={this.useTheme('#666', '#999')} size={30} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.logoutButton,
              backgroundColor: this.useTheme('#f5f5f5', '#161616')
            }}
            onPress={() => {
              this.setState({ modalVisible: true })
            }}
          >
            <Text style={styles.logoutText}>
              {translate('main.settings.logout')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View >
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
    marginTop:
      Dimensions.get('window').width > 800 ? 40
        :
        Dimensions.get('window').width > 700 ? 32
          :
          Dimensions.get('window').width > 600 ? 28
            :
            Dimensions.get('window').width > 500 ? 26
              :
              20,
    marginBottom:
      Dimensions.get('window').width > 800 ? 25
        :
        Dimensions.get('window').width > 700 ? 10
          :
          Dimensions.get('window').width > 600 ? 15
            :
            Dimensions.get('window').width > 500 ? 15
              :
              15,
    height: 56,
    flexDirection: 'row'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center'
  },
  logoutButton: {
    height: 56,
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 24,
    justifyContent: 'center'
  },
  logoutText: {
    color: '#008ee0',
    fontSize: 19,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  modal: {
    height: 168,
    alignSelf: 'center',
    borderRadius: 4
  },
  upperModal: {
    height: 70,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  centerModal: {
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.6,
    borderTopWidth: 0.6
  },
  lowerModal: {
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4
  },
  loadingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingModal: {
    borderRadius: 6,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15
  }
})

const mapStateToProps = ({ app }) => ({
  theme: app.theme,
  isSystemTheme: app.isSystemTheme,
  exitCount: app.exitCount,
  theme: app.theme
})

const mapDiaptchToProps = dispatch => ({
  resetTasks: () => dispatch({ type: 'logout_tasks_reset' }),
  resetEmployees: () => dispatch({ type: 'logout_employees_reset' }),
  resetAccounts: () => dispatch({ type: 'logout_accounts_reset' }),
  incrementExitCount: () => dispatch(incrementExitCount()),
  resetExitCount: () => dispatch(resetExitCount()),
  setTheme: choice => dispatch(setTheme(choice))
})

export default connect(mapStateToProps, mapDiaptchToProps)(SettingsScreen)