import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { fetchEmployees } from '../actions'
import { Icon } from 'native-base'
import Spinner from 'react-native-spinkit'
import EmployeeCard from '../components/EmployeeCard'


class EmployeesListScreen extends Component {
  constructor(props) {
    super(props)
    this.props.fetchEmployees()
    this.state = { searchWord: '' }
  }
  changeSearchWord = (text) => {
    this.setState({ searchWord: text })
  }
  renderScreen() {
    if (!this.props.fetchingEmployees) {
      let reg = RegExp(`${this.state.searchWord}`, 'i')
      let matchedEmployees = this.props.allEmployees.filter(account => reg.test(account[1].name))
      return (
        <FlatList
          contentContainerStyle={{ paddingVertical: 15 }}
          data={matchedEmployees}
          keyExtractor={employee => employee[0]}
          renderItem={employee => (
            <EmployeeCard componentId={this.props.componentId} uid={employee.item[0]} data={employee.item[1]} />
          )}
        />
      )
    }
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
      }}>
        <Text style={{ fontSize: 14, color: '#464953' }}>L</Text>
        <Spinner type='Circle' size={24} color='#008ee0' />
        <Text style={{ fontSize: 14, color: '#464953' }}>ADING</Text>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
              My Employees
            </Text>
          </View>
        </View>
        <View style={styles.searchView}>
          <TextInput
            editable={this.props.fetchingEmployees ? false : true}
            value={this.state.searchWord}
            style={styles.input}
            placeholderTextColor='rgba(255, 255, 255, 0.6)'
            placeholder='Enter a name'
            onChangeText={this.changeSearchWord}
          />
          <Icon
            name='md-search'
            style={styles.searchIcon}
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
    right: 10,
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
    paddingRight: 15,
    paddingLeft: 5,
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
    marginHorizontal: 5,
    fontSize: 16,
    color: '#e3e3e3',
    alignItems: 'center'
  },
  searchIcon: {
    fontSize: 26,
    color: '#e3e3e3'
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