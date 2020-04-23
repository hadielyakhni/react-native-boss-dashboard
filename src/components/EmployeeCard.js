import React, { Component } from 'react'
import { Image, View, Text, StyleSheet, TouchableOpacity, Dimensions, LayoutAnimation, UIManager } from 'react-native'
import { Icon } from 'native-base'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

class EmployeeCard extends Component {
  componentDidMount() {
    LayoutAnimation.configureNext({
      update: {
        duration: 180,
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      }
    })
  }
  componentWillUnmount() {
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
    const { componentId, uid, data } = this.props
    const d = new Date(data.joinDate)
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
          disabled={this.props.activeScreenName === 'employeeDetails'}
          activeOpacity={1}
          style={{ ...styles.infoContainer }}
          onPress={() => {
            Navigation.push(componentId, {
              component: {
                name: 'employeeDetails',
                passProps: { data, uid }
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
                borderColor: this.props.theme === 'light' ? '#f9f9f9' : '#242424'
              }}>
              {data.name}
            </Text>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Text numberOfLines={1} style={{
                fontFamily: 'SourceSansPro-Regular',
                color: this.props.theme === 'light' ? '#303030' : '#fbfbfb',
                fontSize: 17
              }}>
                {data.role + " - "}
              </Text>
              <Text numberOfLines={1} style={{
                fontFamily: 'SourceSansPro-Regular',
                color: this.props.theme === 'light' ? '#303030' : '#fbfbfb',
                fontSize: 17,
                marginRight: Dimensions.get('window').width / 8
              }}>
                since {("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear()}
              </Text>
            </View>
          </View>
          <Icon name='ios-arrow-forward' style={{ fontSize: 28, color: this.props.theme === 'light' ? '#aaa' : '#c5c5c5', }} />
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
    marginHorizontal: 4,
    marginBottom: 12,
    paddingLeft: 9,
    paddingRight: 5,
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
    borderWidth: 1,
    fontSize: 21,
    fontFamily: 'SourceSansPro-SemiBold',
    marginRight: Dimensions.get('window').width / 12,
    marginBottom: 3
  }
})

export default connect(({ app }) => {
  return {
    activeScreenName: app.activeScreenName
  }
})(EmployeeCard)