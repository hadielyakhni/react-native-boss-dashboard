import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Animated,
  Dimensions
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { fetchEmployees } from '../actions'
import { Icon } from 'native-base'
import EmployeeCard from '../components/EmployeeCard'


class EmployeesListScreen extends Component {
  constructor(props) {
    super(props)
    this.props.fetchEmployees()
    this.state = { searchWord: '' }
    this.hintOpacityValue = 0
    this.hintOpacity = new Animated.Value(0)
    this.hintOpacity.addListener(({ value }) => this.hintOpacityValue = value)
    this.hintTranslateY = this.hintOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -Dimensions.get('window').height / 12]
    })
    this.listOpacityValue = 0
    this.listOpacity = new Animated.Value(0)
    this.listOpacity.addListener(({ value }) => this.listOpacityValue = value)
  }
  componentWillUnmount() {
    this.hintOpacity.removeAllListeners()
    this.listOpacity.removeAllListeners()
  }
  changeSearchWord = (text) => {
    this.setState({ searchWord: text })
  }
  renderScreen() {
    if (!this.props.fetchingEmployees) {
      if (!this.props.allEmployees.length) {
        if (this.hintOpacityValue !== 1)
          Animated.timing(this.hintOpacity, {
            toValue: 1,
            duration: 375,
            useNativeDriver: true
          }).start()
        if (this.listOpacityValue !== 0)
          this.listOpacity.setValue(0)
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View style={{ alignItems: 'center', translateY: this.hintTranslateY, opacity: this.hintOpacity }}>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 2 }}>Easily check all</Text>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 5 }}>{''} your employees!</Text>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-Regular', fontSize: 15 }}>Add them now.</Text>
            </Animated.View>
          </View>
        )
      }
      if (this.hintOpacityValue !== 0)
        this.hintOpacity.setValue(0)
      if (this.listOpacityValue !== 1)
        Animated.timing(this.listOpacity, {
          toValue: 1,
          duration: 175,
          useNativeDriver: true
        }).start()
      let reg = RegExp(`${this.state.searchWord}`, 'i')
      let matchedEmployees = this.props.allEmployees.filter(account => reg.test(account[1].name))
      if (!matchedEmployees.length)
        return (
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 12 }}>
            <Text style={{ color: '#ddd', fontFamily: 'SourceSansPro-Regular', fontSize: 17, marginBottom: 2 }}>
              No matching employees found!
            </Text>
          </View>
        )
      return (
        <Animated.View style={{ flex: 1, opacity: this.listOpacity }}>
          <FlatList
            contentContainerStyle={{ paddingVertical: 15 }}
            data={matchedEmployees}
            keyExtractor={employee => employee[0]}
            renderItem={employee => (
              <EmployeeCard componentId={this.props.componentId} uid={employee.item[0]} data={employee.item[1]} />
            )}
          />
        </Animated.View>
      )
    }
    return null
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
              My Employees
            </Text>
          </View>
        </View>
        <View style={styles.searchView}>
          <Icon
            name='md-search'
            style={{ color: this.props.fetchingEmployees || !this.props.allEmployees.length ? '#777' : '#e3e3e3', fontSize: 26 }}
          />
          <TextInput
            editable={this.props.fetchingEmployees || !this.props.allEmployees.length ? false : true}
            value={this.state.searchWord}
            style={styles.input}
            placeholderTextColor='#777'
            placeholder='Search employees'
            onChangeText={this.changeSearchWord}
          />
        </View>
        {this.renderScreen()}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.addButton}
          onPress={() => {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'employeeAdd',
                options: {
                  topBar: { title: { text: 'Add Employee' } }
                }
              }
            })
          }}
        >
          <Icon name='ios-add' style={{ color: '#fff', fontSize: 38 }} />
        </TouchableOpacity>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 5
  },
  header: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#000'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  addButton: {
    position: 'absolute',
    right: 14,
    bottom: 20,
    backgroundColor: '#008ee0',
    height: 55,
    width: 55,
    borderRadius: 27.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addIcon: {
    fontSize: 29,
    color: '#fff',
  },
  searchView: {
    marginBottom: 20,
    marginTop: 10,
    paddingRight: 10,
    paddingLeft: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    height: 46
  },
  input: {
    borderRadius: 10,
    flex: 1,
    color: '#e3e3e3',
    alignItems: 'center',
    fontSize: 17,
    fontFamily: 'SourceSansPro-Regular',
    marginLeft: 8
  }
})

const mapDispatchToProp = dispatch => ({
  fetchEmployees: () => dispatch(fetchEmployees())
})

const mapStateToProps = state => {
  const employees = state.employees.allEmployees
  let allEmployees
  if (employees)
    allEmployees = Object.keys(employees).map(key => [key, employees[key]])
  else
    allEmployees = []
  return {
    allEmployees,
    fetchingEmployees: state.employees.fetchingEmployees
  }
}

export default connect(mapStateToProps, mapDispatchToProp)(EmployeesListScreen)