import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Shimmer from 'react-native-shimmer'

const ToDoLoadingContainer = () => {
  return (
    <View style={{
      marginBottom: 8,
      marginTop: 12
    }}>
      <Shimmer animationOpacity={0.85} style={{ marginTop: -4, marginBottom: 8, width: '30%' }}>
        <Text numberOfLines={1} style={styles.separator}>
        </Text>
      </Shimmer>
      <Shimmer animationOpacity={0.85} style={{ marginVertical: 5 }}>
        <Text numberOfLines={1} style={styles.item}>
        </Text>
      </Shimmer>
      <Shimmer animationOpacity={0.85} style={{ marginVertical: 5 }}>
        <Text numberOfLines={1} style={styles.item}>
        </Text>
      </Shimmer>
      <Shimmer animationOpacity={0.85} style={{ marginTop: 5, marginBottom: 8 }}>
        <Text numberOfLines={1} style={styles.item}>
        </Text>
      </Shimmer>
      <Shimmer animationOpacity={0.85} style={{ marginTop: 15, marginBottom: 8, width: '30%' }}>
        <Text numberOfLines={1} style={styles.separator}>
        </Text>
      </Shimmer>
      <Shimmer animationOpacity={0.85} style={{ marginVertical: 5 }}>
        <Text numberOfLines={1} style={styles.item}>
        </Text>
      </Shimmer>
      <Shimmer animationOpacity={0.85} style={{ marginVertical: 5 }}>
        <Text numberOfLines={1} style={styles.item}>
        </Text>
      </Shimmer>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    opacity: 0.66,
    backgroundColor: '#121212',
    borderRadius: 10
  },
  separator: {
    height: 30,
    color: '#fff',
    marginRight: Dimensions.get('window').width / 12,
    backgroundColor: '#222',
    borderRadius: 8
  },
  item: {
    height: 40,
    color: '#fff',
    marginRight: Dimensions.get('window').width / 12,
    backgroundColor: '#222',
    borderRadius: 8
  }
})

export default ToDoLoadingContainer
