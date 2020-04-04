import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Choice = ({ isSelected, text, onSelect }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => onSelect(text)}
      style={{ height: 44, backgroundColor: '#222', flexDirection: 'row', alignItems: 'center' }}
    >
      <Ionicons
        style={{ marginRight: 26 }}
        name={isSelected ? "md-radio-button-on" : "md-radio-button-off"}
        color={isSelected ? "#008ee0" : "#ccc"}
        size={26}
      />
      <Text style={{ fontSize: 18, fontFamily: 'SourceSansPro-Regular', color: '#fff' }}>
        {text.charAt(0).toUpperCase() + text.substring(1)}
      </Text>
    </TouchableOpacity>
  )
}

export default Choice
