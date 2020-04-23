import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, InteractionManager, Dimensions, UIManager, LayoutAnimation } from 'react-native'
import { Icon } from 'native-base'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

class AccountCard extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    InteractionManager.runAfterInteractions(() => {
      this.setState({ canRender: true })
    })
  }
  componentDidMount() {
    if (this.props.activeScreenName === 'money')
      LayoutAnimation.configureNext({
        update: {
          duration: 180,
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity
        }
      })
  }
  componentWillUnmount() {
    if (this.props.activeScreenName === 'money')
      LayoutAnimation.configureNext({
        update: {
          duration: 80,
          delay: 180,
          type: LayoutAnimation.Types.linear,
          property: LayoutAnimation.Properties.opacity
        }
      })
  }
  render() {
    const { name, amount } = this.props.data[1]
    return (
      <View style={{
        ...styles.container,
        backgroundColor: this.props.theme === 'light' ? '#f9f9f9' : '#242424',
        borderTopWidth: this.props.theme === 'light' ? 0.7 : 0,
        borderLeftWidth: this.props.theme === 'light' ? 1.05 : 0,
        borderWidth: this.props.theme === 'light' ? 1.05 : 0,
        borderBottomWidth: this.props.theme === 'light' ? 1.4 : 0,
        borderColor: this.props.theme === 'light' ? '#eee' : null
      }} >
        <View style={{
          ...styles.imageContainer,
          borderColor: '#fbfbfb',
          opacity: this.props.theme === 'light' ? 0.86 : 1
        }}>
          <Image source={require('../assets/person.png')} style={{ width: '100%', flex: 1 }} />
        </View>
        <TouchableOpacity
          disabled={this.props.activeScreenName === 'moneyDetails'}
          activeOpacity={1}
          style={styles.infoContainer}
          onPress={() => {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'moneyDetails',
                passProps: { accountId: this.props.data[0] }
              }
            })
          }}
        >
          <View style={{ flex: 1, height: 56, justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text
              numberOfLines={1}
              style={{
                ...styles.name,
                color: this.props.theme === 'light' ? '#303030' : '#fbfbfb',
                borderColor: this.props.theme === 'light' ? '#eee' : '#242424'
              }}>
              {name}
            </Text>
            <Text style={{
              fontFamily: 'SourceSansPro-SemiBold',
              color: amount >= 0 ? '#008ee0' : '#de3b5b',
              fontSize: 18
            }}>
              {Math.abs(amount) + ' '}
              <FontAwesome5 name="coins" color={amount >= 0 ? '#008ee0' : '#de3b5b'} size={11} />
            </Text>
          </View>
          <Icon name='ios-arrow-forward' style={{ fontSize: 28, color: '#c5c5c5' }} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 5,
    paddingLeft: 9,
    borderRadius: 10
  },
  imageContainer: {
    height: 56,
    width: 56,
    borderWidth: 1,
    borderRadius: 28
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    paddingLeft: 20,
    paddingRight: 10
  },
  name: {
    fontSize: 21,
    fontFamily: 'SourceSansPro-SemiBold',
    marginRight: Dimensions.get('window').width / 12
  },
  amount: {
    fontSize: 16
  }
})

export default connect(({ app }) => ({
  activeScreenName: app.activeScreenName
}))(AccountCard)