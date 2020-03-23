import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image, InteractionManager } from 'react-native'
import { Icon } from 'native-base'
import { Navigation } from 'react-native-navigation'

export default class EmployeeCard extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { canRender: false }
    InteractionManager.runAfterInteractions(() => {
      this.setState({ canRender: true })
    })
  }
  render() {
    const { name, amount } = this.props.data[1]
    return (
      <View style={styles.container} >
        <View style={styles.imageContainer}>
          <Image source={require('../assets/person.png')} style={{ width: '100%', flex: 1 }} />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.infoContainer}
          onPress={() => {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'moneyDetails',
                passProps: { name, accountId: this.props.data[0] },
                options: {
                  topBar: { title: { text: name } }
                }
              }
            })
          }}
        >
          <View style={{ flex: 1, height: 56, justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={{ fontWeight: 'bold', color: amount >= 0 ? '#008ee0' : '#ff006a', fontSize: 16 }}>
              {Math.abs(amount)} $
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
    backgroundColor: '#121212',
    flexDirection: 'row',
    alignItems: 'center',
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
