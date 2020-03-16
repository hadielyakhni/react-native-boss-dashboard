import React, { PureComponent } from 'react'
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'
import { Navigation } from 'react-native-navigation'

export default class EmployeeCard extends PureComponent {
  render() {
    const { componentId, uid, data } = this.props
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
                passProps: { data, uid },
                options: {
                  topBar: { title: { text: data.name } }
                }
              }
            })
          }}
        >
          <View style={{ flex: 1, height: 56, justifyContent: 'space-between' }}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={{ color: '#c5c5c5', fontSize: 16 }}>{data.role}</Text>
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
    paddingHorizontal: 5,
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
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5
  },
  amount: {
    fontSize: 16
  }
})
