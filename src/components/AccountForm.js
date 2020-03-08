import React, { Component } from 'react'
import { Text, StyleSheet, View, TextInput } from 'react-native'
import { CheckBox } from 'native-base'
import Slider from 'react-native-slider'

export default class AccountForm extends Component {
  render() {
    const { name, status, amount1, amount2, amount3 } = this.props.data
    return (
      <View style={styles.container}>
        <View style={[styles.nameView, this.props.nameViewStyle]}>
          <TextInput
            underlineColorAndroid='#008ee0'
            value={name}
            placeholder='Enter Name'
            placeholderTextColor='rgba(255, 255, 255, 0.6)'
            style={styles.textInput}
            onChangeText={value => this.props.updateInputs('name', value)}
          />
        </View>
        <View style={styles.slidersView}>
          <Text style={styles.inputLabel}>
            0 ==> 100
                    </Text>
          <Slider
            onValueChange={value => this.props.updateInputs('amount1', value)}
            value={amount1}
            minimumValue={0}
            maximumValue={100}
            step={1}
            style={[styles.slider, this.props.sliderStyle]}
            trackStyle={{ height: 10 }}
            thumbStyle={{ borderRadius: 4, height: 28, width: 10 }}
            minimumTrackTintColor='#008ee0'
            maximumTrackTintColor='#464953'
            thumbTintColor='#008ee0'
          />
          <Text style={styles.inputLabel}>
            0 ==> 10000
                    </Text>
          <Slider
            onValueChange={value => this.props.updateInputs('amount2', value)}
            value={amount2}
            minimumValue={0}
            maximumValue={10000}
            step={100}
            style={[styles.slider, this.props.sliderStyle]}
            trackStyle={{ height: 10 }}
            thumbStyle={{ borderRadius: 4, height: 28, width: 10 }}
            minimumTrackTintColor='#008ee0'
            maximumTrackTintColor='#464953'
            thumbTintColor='#008ee0'
          />
          <Text style={styles.inputLabel}>
            0 ==> 1000000
                    </Text>
          <Slider
            onValueChange={value => this.props.updateInputs('amount3', value)}
            value={amount3}
            minimumValue={0}
            maximumValue={1000000}
            step={10000}
            style={[styles.slider, this.props.sliderStyle]}
            trackStyle={{ height: 10 }}
            thumbStyle={{ borderRadius: 4, height: 28, width: 10 }}
            minimumTrackTintColor='#008ee0'
            maximumTrackTintColor='#464953'
            thumbTintColor='#008ee0'
          />
        </View>
        <View style={styles.amountView}>
          <View style={{
            justifyContent: 'space-evenly',
            backgroundColor: '#121212',
            width: 90
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 18
                }}
                color='#16d423'
                checked={status === 'ME'}
                onPress={() => { this.props.updateInputs('status', 'ME') }}
              />
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>ME</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 18
                }}
                color='#ff006a'
                checked={status === 'HIM'}
                onPress={() => { this.props.updateInputs('status', 'HIM') }}
              />
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>HIM</Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.amountLegend}>
                Total Amount
                            </Text>
              <Text style={styles.amountText}>
                {amount1 + amount2 + amount3}
                <Text style={[styles.amountLegend, { fontSize: 36 }]}> $</Text>
              </Text>
            </View>
          </View>
        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    marginBottom: 10,
    backgroundColor: '#121212',
    borderRadius: 10
  },
  nameView: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20
  },
  slidersView: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 18
  },
  inputLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13
  },
  textInput: {
    height: 55,
    fontSize: 15,
    color: '#fff'
  },
  slider: {
    marginTop: 8,
    marginBottom: 30
  },
  amountView: {
    height: 110,
    backgroundColor: '#008ee0',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row'
  },
  amountText: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
    marginTop: 4
  },
  amountLegend: {
    color: '#fff',
    fontSize: 14
  }
})