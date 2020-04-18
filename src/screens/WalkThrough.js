import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider'
import { goToAuth } from '../navigation/navigation'
import { Navigation } from 'react-native-navigation';

const SLIDES = [
  {
    key: '1',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    // image: require('./assets/1.jpg'),
    backgroundColor: '#59b2ab',
  },
  {
    key: '2',
    title: 'Title 2',
    text: 'Other cool stuff',
    // image: require('./assets/2.jpg'),
    backgroundColor: '#febe29',
  },
  {
    key: '3',
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    // image: require('./assets/3.jpg'),
    backgroundColor: '#22bcb5',
  }
]

export default class WalkThrough extends React.Component {
  componentDidMount() {
    Navigation.mergeOptions(this.props.componentId, {
      statusBar: {
        backgroundColor: 'rgba(255, 0, 0, 0)',
        drawBehind: true,
        style: "light",
      }
    })
  }
  renderItem = ({ item }) => {
    return (
      <View style={{ ...styles.slide, backgroundColor: item.backgroundColor }}>
        <Text style={styles.title}>
          {item.title}
        </Text>
        {/* <Image source={item.image} /> */}
        <Text style={styles.text}>{item.text}</Text>
      </View>
    )
  }
  renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    )
  }
  renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    )
  }
  renderSkipButton() {
    return (
      <View style={{ marginTop: 10.5, alignItems: 'flex-end' }}>
        <Text style={{ fontFamily: 'SourceSansPro-SemiBold', fontSize: 19, color: '#f5f5f5' }}>
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
      />
    )
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
    color: '#fbfbfb'
  },
  image: {},
  text: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
    color: '#fbfbfb'
  }
})