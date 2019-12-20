import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { ListItem, Thumbnail, Left, Body, Right, Icon } from 'native-base'
import { navigate } from '../navigationRef'

export default class EmployeeCard extends Component {
  render() {
    const { name, status, amount1, amount2, amount3, amount4 } = this.props.data[1]
    return (
      <ListItem thumbnail style={styles.container}>
        <Left >
          <Thumbnail
            style={styles.thumbnail}
            source={require('../assets/person.png')}
          />
        </Left>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.button}
          onPress={() => navigate('MoneyDetails', { data: this.props.data })}
        >
          <Body style={styles.body}>
            <Text style={styles.name}>{name}</Text>
            <Icon name='ios-arrow-forward' style={styles.arrow} />
          </Body>
        </TouchableOpacity>
        <Right style={styles.right}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
            ${amount1 + amount2 + amount3 + amount4}
          </Text>
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
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 0.2
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 50,
    borderBottomWidth: 0,
    paddingTop: 5,
    paddingBottom: 7,
    paddingLeft: 5
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
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5
  },
  right: {
    width: 150,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
    borderBottomWidth: 0
  },
  button: {
    flex: 1
  },
  arrow: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10
  }
})
