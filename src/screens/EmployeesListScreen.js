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
import { fetchEmployees, restoreLastDeletedEmployee, changeEmployeesSortData } from '../actions'
import { Icon } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import EmployeeCard from '../components/EmployeeCard'
import SortChoicesModal from '../components/SortChoicesModal'

class EmployeesListScreen extends Component {
  constructor(props) {
    super(props)
    this.props.fetchEmployees()
    this.dataAppearsAtLeastOnce = false
    this.sortChoices = [
      { id: "1", prop: "default" },
      { id: "2", prop: "name" },
      { id: "3", prop: "role" },
      { id: "4", prop: "salary - Low to High" },
      { id: "5", prop: "salary - High to Low" },
      { id: "6", prop: "join Date - Oldest to Newest" },
      { id: "7", prop: "join Date - Newest to Oldest" }
    ]
    this.activeSortLabel = ''
    this.state = { searchWord: '', sortChoicesModalVisible: false }
    this.hintOpacityValue = 0
    this.hintOpacity = new Animated.Value(0)
    this.hintOpacity.addListener(({ value }) => this.hintOpacityValue = value)
    this.hintTranslateY = this.hintOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [40, -Dimensions.get('window').height / 12]
    })
    this.listOpacityValue = 0
    this.listOpacity = new Animated.Value(0)
    this.listOpacity.addListener(({ value }) => this.listOpacityValue = value)
    this.sortOpacity = this.hintOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })
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
      if (!this.dataAppearsAtLeastOnce)
        this.dataAppearsAtLeastOnce = true
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
            getItemLayout={(data, index) => (
              { length: 92, offset: 92 * index, index }
            )}
          />
        </Animated.View>
      )
    }
    return null
  }
  closeSortChoicesModal = () => {
    this.setState({ sortChoicesModalVisible: false })
  }
  onSelectSortChoice = choice => {
    this.setState({ sortChoicesModalVisible: false })
    switch (choice) {
      case 'default':
        this.props.changeEmployeesSortData('default', 'asc')
        break
      case 'name':
        this.props.changeEmployeesSortData('name', 'asc')
        break
      case 'role':
        this.props.changeEmployeesSortData('role', 'asc')
        break
      case 'salary - Low to High':
        this.props.changeEmployeesSortData('salary', 'asc')
        break
      case 'salary - High to Low':
        this.props.changeEmployeesSortData('salary', 'desc')
        break
      case 'join Date - Oldest to Newest':
        this.props.changeEmployeesSortData('joinDate', 'asc')
        break
      case 'join Date - Newest to Oldest':
        this.props.changeEmployeesSortData('joinDate', 'desc')
        break
    }
  }
  checkActiveSortLabel() {
    if (this.props.sortBy === 'default' && this.props.sortOrder === 'asc')
      this.activeSortLabel = 'default'
    if (this.props.sortBy === 'name' && this.props.sortOrder === 'asc')
      this.activeSortLabel = 'name'
    if (this.props.sortBy === 'role' && this.props.sortOrder === 'asc')
      this.activeSortLabel = 'role'
    if (this.props.sortBy === 'salary' && this.props.sortOrder === 'asc')
      this.activeSortLabel = 'salary - Low to High'
    if (this.props.sortBy === 'salary' && this.props.sortOrder === 'desc')
      this.activeSortLabel = 'salary - High to Low'
    if (this.props.sortBy === 'joinDate' && this.props.sortOrder === 'asc')
      this.activeSortLabel = 'join Date - Oldest to Newest'
    if (this.props.sortBy === 'joinDate' && this.props.sortOrder === 'desc')
      this.activeSortLabel = 'join Date - Newest to Oldest'
  }
  renderSortButton() {
    if ((!this.props.fetchingAccounts && this.dataAppearsAtLeastOnce) || this.props.allEmployees.length)
      return (
        <Animated.View style={{ justifyContent: 'center', opacity: this.sortOpacity }}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ width: 40, paddingLeft: 4, justifyContent: 'center' }}
            onPress={() => this.setState({ sortChoicesModalVisible: true })}
          >
            <MaterialCommunityIcons name="sort" color="#fff" size={28} />
          </TouchableOpacity>
        </Animated.View>
      )
    else
      return null
  }
  renderUndoMessage() {
    return (
      <View style={[styles.undoView, {
        bottom: this.props.showUndoDelete ? 24.5 : -100
      }]}>
        <Text style={{ fontSize: 15, color: '#fff', fontFamily: 'SourceSansPro-Regular' }}>1 deleted</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ alignItems: 'center', justifyContent: 'center', padding: 6, borderRadius: 6 }}
          onPress={() => {
            this.props.restoreLastDeletedEmployee()
          }}
        >
          <Text style={{ fontSize: 17, fontFamily: 'SourceSansPro-SemiBold', color: '#008ee0' }}>
            Undo
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    { this.checkActiveSortLabel() }
    return (
      <View style={styles.container}>
        {this.renderUndoMessage()}
        <SortChoicesModal
          choices={this.sortChoices}
          visible={this.state.sortChoicesModalVisible}
          selectedChoice={this.activeSortLabel}
          onSelect={this.onSelectSortChoice}
          onCancel={this.closeSortChoicesModal}
        />
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
              My Employees
            </Text>
          </View>
          {this.renderSortButton()}
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
    paddingTop: 8,
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
  undoView: {
    height: 46,
    left: 14,
    right: 88,
    zIndex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#272727',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 6
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
  fetchEmployees: () => dispatch(fetchEmployees()),
  changeEmployeesSortData: (sortBy, sortOrder) => dispatch(changeEmployeesSortData(sortBy, sortOrder)),
  restoreLastDeletedEmployee: () => dispatch(restoreLastDeletedEmployee())
})

const mapStateToProps = state => {

  const { allEmployees: employees, sortBy, sortOrder } = state.employees
  let allEmployees
  if (!!employees && sortBy && sortOrder) {
    if (sortBy === 'default')
      if (sortOrder === 'asc')
        allEmployees = Object.keys(employees).map(key => [key, employees[key]])
      else
        allEmployees = Object.keys(employees).map(key => [key, employees[key]]).reverse()
    if (sortBy === 'name')
      if (sortOrder === 'asc')
        allEmployees = Object.keys(employees).map(key => [key, employees[key]]).sort((a, b) => (a[1].name.toLowerCase() > b[1].name.toLowerCase()) ? 1 : ((b[1].name.toLowerCase() > a[1].name.toLowerCase()) ? -1 : 0))
      else
        allEmployees = Object.keys(employees).map(key => [key, employees[key]]).sort((a, b) => (a[1].name.toLowerCase() > b[1].name.toLowerCase()) ? -1 : ((b[1].name.toLowerCase() > a[1].name.toLowerCase()) ? 1 : 0))
    if (sortBy === 'role')
      if (sortOrder === 'asc')
        allEmployees = Object.keys(employees).map(key => [key, employees[key]]).sort((a, b) => (a[1].role.toLowerCase() > b[1].role.toLowerCase()) ? 1 : ((b[1].role.toLowerCase() > a[1].role.toLowerCase()) ? -1 : 0))
      else
        allEmployees = Object.keys(employees).map(key => [key, employees[key]]).sort((a, b) => (a[1].role.toLowerCase() > b[1].role.toLowerCase()) ? -1 : ((b[1].role.toLowerCase() > a[1].role.toLowerCase()) ? 1 : 0))
    if (sortBy === 'salary')
      if (sortOrder === 'asc')
        allEmployees = Object.keys(employees).map(key => [key, employees[key]]).sort((a, b) => a[1].salary - b[1].salary)
      else
        allEmployees = Object.keys(employees).map(key => [key, employees[key]]).sort((a, b) => b[1].salary - a[1].salary)
    if (sortBy === 'joinDate')
      if (sortOrder === 'asc')
        allEmployees = Object.keys(employees).map(key => [key, employees[key]]).sort((a, b) => a[1].joinDate - b[1].joinDate)
      else
        allEmployees = Object.keys(employees).map(key => [key, employees[key]]).sort((a, b) => b[1].joinDate - a[1].joinDate)
  }
  else
    allEmployees = []
  return {
    allEmployees,
    sortBy,
    sortOrder,
    fetchingEmployees: state.employees.fetchingEmployees,
    showUndoDelete: state.employees.showUndoDelete
  }
}

export default connect(mapStateToProps, mapDispatchToProp)(EmployeesListScreen)