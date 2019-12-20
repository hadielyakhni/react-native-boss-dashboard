import React, { Component } from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import { ListItem, Thumbnail, Left, Body, Right, Icon } from 'native-base'
import { navigate } from '../navigationRef'

export default class EmployeeCard extends Component {
  render() {
    const { uid, data } = this.props
    return (
      <ListItem thumbnail style={styles.container}>
        <Left >
          <Thumbnail
            style={styles.thumbnail}
            source={require('../assets/person.png')}
          />
        </Left>
        <Body style={styles.body}>
          <Text style={styles.name}>{data.name}</Text>
          <Text note numberOfLines={2} style={{ color: '#717171' }}>{data.role}</Text>
        </Body>
        <Right style={styles.right}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.arrowButton}
            onPress={() => navigate('EmployeeDetails', { uid, data })}
          >
            <Icon
              name='ios-arrow-forward'
              style={styles.arrow}
            />
          </TouchableOpacity>
        </Right>
      </ListItem>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: '#121212',
    paddingLeft: 12,
    marginLeft: 0,
    marginBottom: 10,
    borderRadius: 10
  },
  body: {
    justifyContent: 'center',
    marginLeft: 20,
    paddingRight: 50,
    borderBottomWidth: 0
  },
  thumbnail: {
    height: 56,
    width: 56,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 28
  },
  name: {
    borderColor: '#121212',
    borderWidth: 1,
    fontSize: 19,
    color: '#e5e5e5',
    fontWeight: 'bold'
  },
  right: {
    width: 40,
    alignItems: 'center',
    paddingRight: 0,
    borderBottomWidth: 0
  },
  arrowButton: {
    height: 80,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  arrow: {
    fontSize: 30
  }
})
