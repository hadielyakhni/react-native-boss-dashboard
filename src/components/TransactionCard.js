import React from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const TransactionCard = ({ data }) => {
  const { transAmount, status, date } = data[1]
  const getDateFormatted = date => {
    const d = new Date(date)
    return ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }
  return (
    <View style={styles.container}>
      <View style={[styles.arrowIconContainer, {
        backgroundColor: status === 'Sent' ? '#34282d' : '#2e3b47'
      }]}>
        <FontAwesome
          name={status === 'Sent' ? 'arrow-up' : 'arrow-down'}
          color={status === 'Sent' ? "#de3b5b" : "#008ee0"}
          size={22}
        />
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.upperDataContainer}>
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>
            {status}
          </Text>
          <Text ellipsizeMode="middle" numberOfLines={1} style={{
            flex: 1,
            textAlign: 'right',
            marginLeft: 24,
            fontSize: 18,
            fontWeight: 'bold',
            color: status === 'Sent' ? "#de3b5b" : "#008ee0"
          }}>
            {transAmount + " "}
          </Text>
          <View style={{ justifyContent: 'flex-end' }}>
            <FontAwesome5 name="coins" color={status === 'Sent' ? "#de3b5b" : "#008ee0"} size={13} />
          </View>
        </View>
        <View style={styles.lowerDataContainer}>
          <Text style={styles.lowerDataContainerText}>
            {data[0]}
          </Text>
          <Text style={styles.lowerDataContainerText}>
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
    backgroundColor: '#121212',
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
    fontSize: 12,
    fontWeight: '100',
    color: 'rgba(140, 140, 140 , 0.75)'
  }
})
