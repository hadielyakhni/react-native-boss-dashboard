import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, LayoutAnimation, UIManager } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const TransactionCard = ({ data, theme }) => {
  const { transAmount, status, date } = data[1]
  const getDateFormatted = date => {
    const d = new Date(date)
    return ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }
  return (
    <View style={{
      ...styles.container,
      backgroundColor: theme === 'light' ? '#f9f9f9' : '#242424',
      borderTopWidth: theme === 'light' ? 0.7 : 0,
      borderLeftWidth: theme === 'light' ? 1.05 : 0,
      borderWidth: theme === 'light' ? 1.05 : 0,
      borderBottomWidth: theme === 'light' ? 1.4 : 0,
      borderColor: theme === 'light' ? '#eee' : null
    }}>
      <View style={[styles.arrowIconContainer, {
        backgroundColor: status === 'Sent' ?
          theme === 'light' ? '#f6f6f6' : '#34282d'
          :
          theme === 'light' ? '#f6f6f6' : '#2e3b47'
      }]}>
        <FontAwesome
          name={status === 'Sent' ? 'arrow-up' : 'arrow-down'}
          color={status === 'Sent' ? "#de3b5b" : "#008ee0"}
          size={22}
          style={{ opacity: 0.75 }}
        />
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.upperDataContainer}>
          <Text style={{
            fontSize: 20,
            color: theme === 'light' ? '#303030' : '#fbfbfb',
            fontFamily: 'SourceSansPro-SemiBold'
          }}>
            {status}
          </Text>
          <Text ellipsizeMode="middle" numberOfLines={1} style={{
            flex: 1,
            textAlign: 'right',
            marginLeft: 24,
            fontSize: 19.5,
            fontFamily: 'SourceSansPro-Bold',
            color: status === 'Sent' ? "#de3b5b" : "#008ee0"
          }}>
            {transAmount + " "}
          </Text>
          <View style={{ justifyContent: 'flex-end', marginLeft: 2 }}>
            <FontAwesome5 name="coins" color={status === 'Sent' ? "#de3b5b" : "#008ee0"} size={13} />
          </View>
        </View>
        <View style={styles.lowerDataContainer}>
          <Text style={{
            ...styles.lowerDataContainerText,
            color: theme === 'light' ? '#000' : '#aaa'
          }}>
            {data[0]}
          </Text>
          <Text style={{
            ...styles.lowerDataContainerText,
            color: theme === 'light' ? '#000' : '#aaa'
          }}>
            {getDateFormatted(date)}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default TransactionCard

const styles = StyleSheet.create({
  container: {
    height: 75,
    marginVertical: 3,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Dimensions.get('window').width / 28
  },
  arrowIconContainer: {
    height: 38,
    width: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginRight: 8
  },
  dataContainer: {
    height: 48,
    paddingLeft: 4,
    flex: 1
  },
  upperDataContainer: {
    height: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  lowerDataContainer: {
    height: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  lowerDataContainerText: {
    fontSize: 13,
    fontFamily: 'SourceSansPro-Light'
  }
})
