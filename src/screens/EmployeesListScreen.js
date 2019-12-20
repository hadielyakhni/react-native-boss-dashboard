import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native'
import { connect } from 'react-redux'
import { fetchEmployees } from '../actions'
import { Icon } from 'native-base'
import Spinner from 'react-native-spinkit'
import EmployeeCard from '../components/EmployeeCard'


class EmployeesListScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      title: 'MY EMPLOYEES',
      headerStyle: { backgroundColor: '#000', height: 70 },
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            params.clearSearchWord()
            navigation.navigate('EmployeeAdd')
          }}
        >
          <Icon
            name='md-add'
            style={styles.addIcon}
          />
        </TouchableOpacity>
      )
    }
  }
  constructor(props) {
    super(props)
    this.props.fetchEmployees()
    this.state = {
      searchWord: ''
    }
    this.props.navigation.setParams({
      clearSearchWord: () => {
        this.setState({ searchWord: '' })
      }
    })
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
          renderItem={employee => <EmployeeCard uid={employee.item[0]} data={employee.item[1]} />}
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 5
  },
  addButton: {
    marginRight: 10,
    width: 30,
    alignItems: 'center'
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