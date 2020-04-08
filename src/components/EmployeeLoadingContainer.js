import React from 'react'
import { FlatList, View } from 'react-native'
import EmployeeCardShimmer from './EmployeeCardShimmer'

const EmployeeLoadingContainer = () => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ paddingVertical: 15 }}
        data={['1', '2', '3', '4']}
        keyExtractor={dummy => dummy}
        renderItem={() => <EmployeeCardShimmer />}
        getItemLayout={(data, index) => (
          { length: 92, offset: 92 * index, index }
        )}
      />
    </View>
  )
}

export default EmployeeLoadingContainer