import React, { PureComponent } from 'react'
import { Image, View, Text, StyleSheet, TouchableOpacity, Dimensions, UIManager, LayoutAnimation } from 'react-native'
import { Icon } from 'native-base'
import { Navigation } from 'react-native-navigation'

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

export default class EmployeeCard extends PureComponent {
  componentDidMount() {
    LayoutAnimation.configureNext({
      update: {
        duration: 80,
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      }
    })
  }
  componentWillUnmount() {
    LayoutAnimation.configureNext({
      update: {
        duration: 80,
        delay: 200,
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      }
    })
  }
  render() {
    const { componentId, uid, data } = this.props
    const d = new Date(data.joinDate)
    return (
      <View style={styles.container} >
        <View style={styles.imageContainer}>
          <Image source={require('../assets/person.png')} style={{ width: '100%', flex: 1 }} />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.infoContainer}
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
            <Text numberOfLines={1} style={styles.name}>
              {data.name}
            </Text>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Text numberOfLines={1} style={{
                fontFamily: 'SourceSansPro-Regular',
                color: '#eee',
                fontSize: 17
              }}>
                {data.role + " - "}
              </Text>
              <Text numberOfLines={1} style={{
                fontFamily: 'SourceSansPro-Regular',
                color: '#eee',
                fontSize: 17,
                marginRight: Dimensions.get('window').width / 8
              }}>
                since {("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear()}
              </Text>
            </View>
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
    backgroundColor: '#121212',
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
    borderColor: '#fff',
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
    borderColor: '#121212',
    borderWidth: 1,
    fontSize: 21,
    color: '#fff',
    fontFamily: 'SourceSansPro-SemiBold',
    marginRight: Dimensions.get('window').width / 12,
    marginBottom: 3
  }
})
