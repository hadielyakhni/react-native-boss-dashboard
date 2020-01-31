import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { ListItem, Thumbnail, Left, Body, Right, Icon } from 'native-base'
import { navigate } from '../navigationRef'

export default class EmployeeCard extends Component {
    render() {
        const { name, status, amount1, amount2, amount3 } = this.props.data[1]
        return (
            <View style={styles.container} >
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/person.png')} style={{ width: '100%', flex: 1 }} />
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.infoContainer}
                    onPress={() => navigate('MoneyDetails', { data: this.props.data })
                    }>
                    <View style={{ flex: 1, height: 56, justifyContent: 'space-between' }}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={{ color: status === 'ME' ? '#008ee0' : '#ff006a', fontSize: 16 }}>
                            {amount1 + amount2 + amount3} $$
                        </Text>
                    </View>
                    <Icon name='ios-arrow-forward' style={{ fontSize: 28, color: '#fff' }} />
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
        alignItems: 'center'
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
