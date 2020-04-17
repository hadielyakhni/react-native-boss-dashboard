import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList } from 'react-native'
import Choice from './Choice'

const ChoicesModal = ({ visible, choices, selectedChoice, onSelect, onCancel, theme }) => {
  return (
    <Modal
      onRequestClose={onCancel}
      animationType="fade"
      visible={visible}
      transparent
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onCancel}
        style={[StyleSheet.absoluteFill, {
          backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)',
          zIndex: 0
        }]}></TouchableOpacity>
      <View
        style={{
          backgroundColor: 'tranparent',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <View style={{
          width: 365,
          backgroundColor: theme === 'light' ? '#f5f5f5' : '#303030',
          borderRadius: 8,
          padding: 24
        }}>
          <Text style={{
            color: theme === 'light' ? '#303030' : '#fbfbfb',
            fontSize: 24,
            fontFamily: 'SourceSansPro-SemiBold'
          }}>
            Sort By
          </Text>
          <View style={{
            paddingTop: 18,
            marginBottom: 10,
            backgroundColor: theme === 'light' ? '#f5f5f5' : '#303030'
          }}>
            <FlatList
              data={choices}
              keyExtractor={choice => choice.id}
              renderItem={choice => (
                <Choice
                  theme={theme}
                  text={choice.item.prop}
                  isSelected={choice.item.prop === selectedChoice}
                  onSelect={onSelect}
                />
              )}
            />
          </View>
        </View>
      </View>
    </Modal >
  )
}

export default React.memo(ChoicesModal)