import React from 'react'
import { Text, View, StyleSheet, Image, Dimensions, I18nManager, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider'
import { goToAuth } from '../navigation/navigation'
import { Navigation } from 'react-native-navigation'
import AsyncStorage from '@react-native-community/async-storage'
import SplashScreen from 'react-native-splash-screen'
import { translate, isRTL, getUsedLanguage } from '../utils/i18n'
import i18n from 'i18n-js'

export default class WalkThrough extends React.Component {
  SLIDES = [
    {
      key: '0',
      title: translate('walkthrough.intro.title'),
      text: translate('walkthrough.intro.text'),
      imageURI: "welcome_min"
    },
    {
      key: '1',
      title: i18n.t('walkthrough.todoList.title'),
      text: i18n.t('walkthrough.todoList.text'),
      imageURI: "todo_min"
    },
    {
      key: '2',
      title: i18n.t('walkthrough.employees.title'),
      text: i18n.t('walkthrough.employees.text'),
      imageURI: "employees_min"
    },
    {
      key: '3',
      title: i18n.t('walkthrough.money.title'),
      text: i18n.t('walkthrough.money.text'),
      imageURI: "money_min"
    },
    {
      title: translate('walkthrough.policies.title'),
      key: '4',
      imageURI: "pp_tou_min"
    }
  ]
  componentDidMount() {
    I18nManager.allowRTL(true)
    setTimeout(() => {
      SplashScreen.hide()
    }, 125);
    Navigation.mergeOptions(this.props.componentId, {
      statusBar: {
        backgroundColor: 'rgba(255, 0, 0, 0)',
        drawBehind: true,
        style: this.props.systemTheme === 'dark' ? 'light' : 'dark',
      }
    })
  }
  useTheme(lightColor, darkColor) {
    if (this.props.systemTheme === 'dark')
      return darkColor
    return lightColor
  }
  getText() {
    const text = translate('walkthrough.policies.text')
    const privacyPolicy = translate('walkthrough.policies.privacyPolicy')
    const termsOfUse = translate('walkthrough.policies.termsOfUse')
    const our = translate('walkthrough.policies.our')
    const and = translate('walkthrough.policies.and')
    return (
      <Text style={{ lineHeight: 30 }}>
        {text + ' '}
        {getUsedLanguage() === 'arabic' ? null : our + ' '}
        <Text onPress={() => Linking.openURL('https://boss-dashboard.netlify.app/privacypolicy')} style={{ color: '#008ee0' }}>
          {privacyPolicy + ' '}
        </Text>
        {and + ' '}
        <Text onPress={() => Linking.openURL('https://boss-dashboard.netlify.app/termsofuse')} style={{ color: '#008ee0' }}>
          {termsOfUse + ' '}
        </Text>
        {getUsedLanguage() === 'arabic' ? our : null}
      </Text>
    )
  }
  renderItem = ({ item }) => {
    return (
      <View style={{ ...styles.slide, backgroundColor: this.useTheme('#f7f7f7', '#161616') }}>
        <View style={{
          flex: 1.9,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{ ...styles.title, color: this.useTheme('#303030', '#fbfbfb') }}>
            {item.title}
          </Text>
        </View >
        <View style={{
          flex: 3,
          justifyContent: 'center'
        }}>
          <Image
            source={{ uri: item.imageURI }}
            style={{
              height: item.key === "1" ?
                Dimensions.get('window').width / 1.32
                : item.key === "2" ? Dimensions.get('window').width / 1.3
                  : item.key === "4" ? Dimensions.get('window').width / 1.6
                    : Dimensions.get('window').width / 1.5,
              width: item.key === "1" ?
                Dimensions.get('window').width / 1.32
                : item.key === "2" ? Dimensions.get('window').width / 1.3
                  : Dimensions.get('window').width / 1.1,
              maxHeight: item.key === "0" ? 600 : 460,
              maxWidth: item.key === "0" || item.key === "3" ? 500 : 400
            }}
          />
        </View>
        <View style={{
          flex: 2,
          justifyContent: 'center',
          paddingBottom: 100
        }}>
          <Text style={{
            ...styles.text,
            color: this.useTheme('#303030', '#fbfbfb'),
            width: item.key !== "0" ? Dimensions.get('window').width / 1.5 : Dimensions.get('window').width / 1.3
          }}>
            {item.text || this.getText()}
          </Text>
        </View>
      </View >
    )
  }
  renderNextButton = () => {
    return (
      <View style={{
        ...styles.buttonCircle,
        backgroundColor: this.useTheme('rgba(0, 0, 0, .2)', 'rgba(255,255,255,.1)')
      }}>
        <Icon
          name={!isRTL() ? "md-arrow-round-forward" : "md-arrow-round-back"}
          color="#fbfbfb"
          size={24}
        />
      </View>
    )
  }
  renderDoneButton = () => {
    return (
      <View style={{
        ...styles.buttonCircle,
        backgroundColor: this.useTheme('rgba(0, 0, 0, .2)', 'rgba(255,255,255,.1)')
      }}>
        <Icon
          name="md-checkmark"
          color="#fbfbfb"
          size={24}
        />
      </View>
    )
  }
  renderSkipButton = () => {
    return (
      <View style={{ marginTop: 10.5, alignItems: 'flex-end', marginLeft: 4 }}>
        <Text style={{ fontFamily: 'SourceSansPro-SemiBold', fontSize: 19, color: this.useTheme('#303030', '#fbfbfb') }}>
          {translate('walkthrough.skip')}
        </Text>
      </View>
    )
  }
  render() {
    return (
      <AppIntroSlider
        ref={ref => this.listRef = ref}
        data={this.SLIDES}
        renderItem={this.renderItem}
        renderDoneButton={this.renderDoneButton}
        renderNextButton={this.renderNextButton}
        onDone={() => {
          I18nManager.allowRTL(false)
          goToAuth()
          AsyncStorage.setItem('isOpenedBefore', "true")
        }}
        onSkip={() => {
          this.listRef.goToSlide(4)
        }}
        showSkipButton
        renderSkipButton={this.renderSkipButton}
        activeDotStyle={{ backgroundColor: this.useTheme('#303030', '#fbfbfb') }}
        dotStyle={{ backgroundColor: this.useTheme('rgba(0, 0, 0, .2)', 'rgba(255,255,255,.2)') }}
      />
    )
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center'
  },
  buttonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4
  },
  title: {
    fontFamily: 'SourceSansPro-Bold',
    fontSize: 30,
    maxWidth: 200,
    textAlign: 'center'
  },
  text: {
    fontFamily: 'SourceSansPro-SemiBold',
    textAlign: 'center',
    maxWidth: 400,
    paddingTop: Dimensions.get('window').height / Dimensions.get('window').width > 1.6 ? 0 : 80,
    fontSize: 19,
  }
})