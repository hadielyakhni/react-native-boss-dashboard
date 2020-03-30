import React from 'react'
import { View, Text } from 'react-native'

const Separator = ({ text }) => {
  return (
    <View style={styles.view}>
      <Text style={styles.text}>
        {text}
      </Text>
    </View>
  )
}

const styles = {
  view: {
    height: 26,
    justifyContent: 'center',
    marginLeft: 1
  },
  text: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'SourceSansPro-Regular'
  }
}

export default React.memo(Separator)