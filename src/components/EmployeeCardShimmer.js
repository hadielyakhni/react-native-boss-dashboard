import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import Shimmer from 'react-native-shimmer'

export default class EmployeeCard extends PureComponent {
  render() {
    const { theme } = this.props
    return (
      <View style={{
        ...styles.container,
        backgroundColor: theme === 'light' ? '#ddd' : '#222'
      }} >
        <Shimmer >
          <View style={{
            ...styles.imageContainer,
            backgroundColor: theme === 'light' ? '#bbb' : '#333'
          }}>
          </View>
        </Shimmer>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.infoContainer}
        >
          <View style={{ flex: 1, height: 56, flexDirection: 'column', alignItems: 'flex-start', paddingVertical: 3 }}>
            <Shimmer style={{ marginBottom: 4, height: 23 }}>
              <Text numberOfLines={1} style={{
                ...styles.name,
                borderColor: theme === 'light' ? '#bbb' : '#333',
                backgroundColor: theme === 'light' ? '#bbb' : '#333'
              }}>
              </Text>
            </Shimmer>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <Shimmer style={{ height: 23 }}>
                <Text numberOfLines={1} style={{
                  ...styles.roleText,
                  borderColor: theme === 'light' ? '#bbb' : '#333',
                  backgroundColor: theme === 'light' ? '#bbb' : '#333'
                }}>
                </Text>
              </Shimmer>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    opacity: 0.66,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginBottom: 12,
    paddingHorizontal: 5,
    paddingLeft: 9,
    borderRadius: 10
  },
  imageContainer: {
    height: 56,
    width: 56,
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
    width: 160,
    borderRadius: 6
  },
  roleText: {
    borderWidth: 1,
    fontFamily: 'SourceSansPro-Regular',
    color: '#eee',
    fontSize: 21,
    width: 100,
    borderRadius: 6
  }
})
