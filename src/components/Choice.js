import React, { useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { translate } from '../utils/i18n'

const Choice = ({ isSelected, text, onSelect, theme }) => {
  const [linesLenght, setLinesLength] = useState(1)
  const choice = text.charAt(0).toUpperCase() + text.substring(1)
  const getChoice = () => {
    switch (choice) {
      case 'Time':
        return translate('components.choicesModal.sortModal.options.time')
      case 'Title':
        return translate('components.choicesModal.sortModal.options.title')
      case 'Default':
        return translate('components.choicesModal.sortModal.options.default')
      case 'Name':
        return translate('components.choicesModal.sortModal.options.name')
      case 'Role':
        return translate('components.choicesModal.sortModal.options.role')
      case 'Salary - Low to High':
        return translate('components.choicesModal.sortModal.options.salaryLowToHigh')
      case 'Salary - High to Low':
        return translate('components.choicesModal.sortModal.options.salaryHighToLow')
      case 'Join Date - Oldest to Newest':
        return translate('components.choicesModal.sortModal.options.joinDateOldestToNewest')
      case 'Join Date - Newest to Oldest':
        return translate('components.choicesModal.sortModal.options.joinDateNewestToOldest')
      case 'Amount - Low to High':
        return translate('components.choicesModal.sortModal.options.amountLowToHigh')
      case 'Amount - High to Low':
        return translate('components.choicesModal.sortModal.options.amountHighToLow')
      case 'Last transaction - Oldest to Newest':
        return translate('components.choicesModal.sortModal.options.lastTransactionOldestToNewest')
      case 'Last transaction - Newest to Oldest':
        return translate('components.choicesModal.sortModal.options.lastTransactionNewestToOldest')
      case 'System':
        return translate('components.choicesModal.languagesModal.options.system')
      case 'English':
        return translate('components.choicesModal.languagesModal.options.english')
      case 'French':
        return translate('components.choicesModal.languagesModal.options.french')
      case 'Arabic':
        return translate('components.choicesModal.languagesModal.options.arabic')
      case 'Light':
        return translate('components.choicesModal.themesModal.options.light')
      case 'Dark':
        return translate('components.choicesModal.themesModal.options.dark')
    }
  }
  const onTextLayout = e => setLinesLength(e.nativeEvent.lines.length)
  onPress = () => onSelect(text)
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={{
        height: 44,
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#303030',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: linesLenght > 1 ? 10 : 0
      }}
    >
      <Ionicons
        style={{ marginRight: 26 }}
        name={isSelected ? "md-radio-button-on" : "md-radio-button-off"}
        color={isSelected ? "#008ee0" : theme === 'light' ? '#5a5a5a' : '#ccc'}
        size={26}
      />
      <Text onTextLayout={onTextLayout} style={{
        fontSize: 18,
        fontFamily: 'SourceSansPro-Regular',
        color: theme === 'light' ? '#303030' : '#fbfbfb',
        maxWidth: 275
      }}>
        {getChoice()}
      </Text>
    </TouchableOpacity>
  )
}

export default Choice
