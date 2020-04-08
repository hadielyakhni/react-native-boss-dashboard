import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Shimmer from 'react-native-shimmer'
import EmployeeCardShimmer from './EmployeeCardShimmer'

const AccountsLoadingContainer = () => {
  return (
    <View style={{
      marginBottom: 8,
      marginTop: 12
    }}>
      <View style={{ paddingHorizontal: 8, marginBottom: 5, marginTop: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Shimmer>
            <Text style={{ borderRadius: 6, fontSize: 22, backgroundColor: '#222', width: 110 }}>
            </Text>
          </Shimmer>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 20 }}>
          <Shimmer>
            <Text style={{ borderRadius: 6, fontSize: 22, backgroundColor: '#222', width: 160 }}>
            </Text>
          </Shimmer>
        </View>
      </View>
      <EmployeeCardShimmer />
      <EmployeeCardShimmer />
      <EmployeeCardShimmer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    opacity: 0.66,
    backgroundColor: '#121212',
    borderRadius: 10
  },
  separator: {
    height: 56,
    color: '#fff',
    marginRight: Dimensions.get('window').width / 12,
    backgroundColor: '#222',
    borderRadius: 8
  },
  item: {
    height: 80,
    color: '#fff',
    marginRight: Dimensions.get('window').width / 12,
    backgroundColor: '#222',
    borderRadius: 8
  },
  name: {
    borderColor: '#222',
    borderWidth: 1,
    fontSize: 100,
    color: '#fff',
    fontFamily: 'SourceSansPro-SemiBold',
    marginRight: Dimensions.get('window').width / 12,
    backgroundColor: '#222',
    width: 160,
    borderRadius: 6
  }
})

export default AccountsLoadingContainer