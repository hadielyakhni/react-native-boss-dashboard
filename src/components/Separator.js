import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Separator = ({ text, number }) => {
  return (
    <View style={styles.view}>
      <Text style={styles.text}>
        {text + "  "}
      </Text>
      <Text style={styles.number}>
        ({number})
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    marginBottom: 6,
    marginTop: 8,
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  text: {
    fontSize: 14.5,
    color: '#eee',
    fontFamily: 'SourceSansPro-SemiBold'
  },
  number: {
    color: '#eee',
    fontFamily: 'SourceSansPro-SemiBold'
  }
})

export default React.memo(Separator)