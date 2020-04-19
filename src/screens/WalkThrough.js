import React from 'react'
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider'
import { goToAuth } from '../navigation/navigation'
import { Navigation } from 'react-native-navigation';

const SLIDES = [
  {
    key: '0',
    title: 'Welcome!',
    text: 'Boss Dashboard provides you with 3 utility tools to improve your production and manage your buisiness!',
    imageURI: "welcome_min"
  },
  {
    key: '1',
    title: 'Todo List',
    text: 'Simple Todo list and note taker to help you achieve more.',
    imageURI: "todo_min"
  },
  {
    key: '2',
    title: 'Employees',
    text: 'Easily manage all your employees and contact them from one place.',
    imageURI: "employees_min"
  },
  {
    key: '3',
    title: 'Transactions',
    text: 'Quickly reach and manage all people you have money with them and vise versa.',
    imageURI: "money_min"
  }
]

export default class WalkThrough extends React.Component {
  componentDidMount() {
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
            fadeDuration={200}
            source={{ uri: item.imageURI }}
            style={{
              height: item.key === "1" ?
                Dimensions.get('window').width / 1.32
                : item.key === "2" ? Dimensions.get('window').width / 1.3
                  : Dimensions.get('window').width / 1.5,
              width: item.key === "1" ?
                Dimensions.get('window').width / 1.32
                : item.key === "2" ? Dimensions.get('window').width / 1.3
                  : Dimensions.get('window').width / 1.1,
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
            fontSize: 20,
            color: this.useTheme('#303030', '#fbfbfb'),
            width: item.key !== "0" ? Dimensions.get('window').width / 1.5 : Dimensions.get('window').width / 1.2,
            lineHeight: item.key !== "0" ? 20 : 27
          }}>
            {item.text}
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
          name="md-arrow-round-forward"
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
          Skip
        </Text>
      </View>
    )
  }
  render() {
    return (
      <AppIntroSlider
        data={SLIDES}
        renderItem={this.renderItem}
        renderDoneButton={this.renderDoneButton}
        renderNextButton={this.renderNextButton}
        onSlideChange={this.onSlideChange}
        onDone={() => goToAuth(true)}
        onSkip={() => goToAuth(true)}
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
    fontSize: 32,
  },
  text: {
    fontFamily: 'SourceSansPro-SemiBold',
    textAlign: 'center'
  }
})