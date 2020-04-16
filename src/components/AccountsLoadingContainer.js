import React from 'react'
import { View, Text } from 'react-native'
import Shimmer from 'react-native-shimmer'
import EmployeeCardShimmer from './EmployeeCardShimmer'

const AccountsLoadingContainer = ({ theme }) => {
  return (
    <View style={{
      marginBottom: 8,
      marginTop: 12
    }}>
      <View style={{ paddingHorizontal: 8, marginBottom: 5, marginTop: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Shimmer>
            <Text style={{
              borderRadius: 6,
              fontSize: 22,
              width: 110,
              backgroundColor: theme === 'light' ? '#e6e6e6' : '#222'
            }}>
            </Text>
          </Shimmer>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 12, marginBottom: 18 }}>
          <Shimmer>
            <Text style={{
              borderRadius: 6,
              fontSize: 22,
              width: 160,
              backgroundColor: theme === 'light' ? '#e6e6e6' : '#222'
            }}>
            </Text>
          </Shimmer>
        </View>
      </View>
      <EmployeeCardShimmer theme={theme} />
      <EmployeeCardShimmer theme={theme} />
      <EmployeeCardShimmer theme={theme} />
    </View>
  )
}

export default AccountsLoadingContainer