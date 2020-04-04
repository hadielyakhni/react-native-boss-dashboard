import React from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity, FlatList } from 'react-native'
import Choice from './Choice'

const SortChoicesModal = ({ visible, choices, selectedChoice, onSelect, onCancel }) => {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onCancel()}
        style={[StyleSheet.absoluteFill, {
          backgroundColor: 'rgba(0,0,0,0.25)',
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
          backgroundColor: '#222',
          borderRadius: 8,
          padding: 24
        }}>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'SourceSansPro-SemiBold' }}>
            Sort By
          </Text>
          <View style={{ paddingTop: 18, marginBottom: 10, backgroundColor: '#222' }}>
            <FlatList
              data={choices}
              keyExtractor={choice => choice.id}
              renderItem={choice => (
                <Choice
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

export default React.memo(SortChoicesModal)