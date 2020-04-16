import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Choice = ({ isSelected, text, onSelect, theme }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => onSelect(text)}
      style={{
        height: 44,
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#303030',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <Ionicons
        style={{ marginRight: 26 }}
        name={isSelected ? "md-radio-button-on" : "md-radio-button-off"}
        color={isSelected ? "#008ee0" : theme === 'light' ? '#5a5a5a' : '#ccc'}
        size={26}
      />
      <Text style={{
        fontSize: 18,
        fontFamily: 'SourceSansPro-Regular',
        color: theme === 'light' ? '#303030' : '#fbfbfb'
      }}>
        {text.charAt(0).toUpperCase() + text.substring(1)}
      </Text>
    </TouchableOpacity>
  )
}

export default Choice
