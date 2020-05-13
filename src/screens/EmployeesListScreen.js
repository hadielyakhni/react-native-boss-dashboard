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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import EmployeeCard from '../components/EmployeeCard'
import EmployeeLoadingContainer from '../components/EmployeeLoadingContainer'
import SortChoicesModal from '../components/ChoicesModal'
import { translate, isRTL } from '../utils/i18n'

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
    this.state = { searchWord: '', sortChoicesModalVisible: false, isAddButtonDisabled: false }
    this.clearIconOpacity = new Animated.Value(0)
    this.clearIconAngle = this.clearIconOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1.57, 3.14]
    })
    this.hintOpacityValue = 0
    this.hintOpacity = new Animated.Value(0)
    this.hintOpacity.addListener(({ value }) => this.hintOpacityValue = value)
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
  changeSearchWord = text => {
    if (text && !this.state.searchWord)
      Animated.timing(this.clearIconOpacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true
      }).start()
    else if (!text && this.state.searchWord)
      Animated.timing(this.clearIconOpacity, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true
      }).start()
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
            <Animated.View style={{
              alignItems: 'center',
              opacity: this.hintOpacity,
              marginBottom: 140
            }}>
              <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 2 }}>{translate('main.employeesList.hint1')}</Text>
              <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 5 }}>{''} {translate('main.employeesList.hint2')}</Text>
              <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-Regular', fontSize: 15 }}>{translate('main.employeesList.hint3')}</Text>
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
            <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-Regular', fontSize: 17, marginBottom: 2 }}>
              No matching employees found!
            </Text>
          </View>
        )
      return (
        <Animated.View style={{ flex: 1, opacity: this.listOpacity }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 15 }}
            data={matchedEmployees}
            keyExtractor={employee => employee[0]}
            renderItem={employee => {
              return (
                <EmployeeCard
                  componentId={this.props.componentId}
                  uid={employee.item[0]}
                  data={employee.item[1]}
                  theme={this.props.theme}
                />
              )
            }}
            getItemLayout={(data, index) => (
              { length: 92, offset: 92 * index, index }
            )}
          />
        </Animated.View>
      )
    }
    return <EmployeeLoadingContainer theme={this.props.theme} />
  }
  checkExit() {
    if (this.props.exitCount === 0)
      return null
    if (this.props.exitCount === 1) {
      return <View style={{
        paddingHorizontal: 20,
        borderRadius: 16,
        height: 38,
        backgroundColor: 'rgba(85, 85, 85, 0.85)',
        position: 'absolute',
        zIndex: 1,
        bottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      }}>
        <Text style={{ fontSize: 15, color: '#ffffff', fontFamily: 'SourceSansPro-Regular' }}>{translate('components.confirmExitModal.message')}</Text>
      </View>
    }
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
    if ((!this.props.fetchingEmployees && this.dataAppearsAtLeastOnce) || this.props.allEmployees.length)
      return (
        <Animated.View style={{ justifyContent: 'center', opacity: this.sortOpacity }}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={this.hintOpacity === 1}
            style={{ width: 40, paddingHorizontal: 6, justifyContent: 'center' }}
            onPress={() => this.setState({ sortChoicesModalVisible: true })}
          >
            <MaterialCommunityIcons name="sort" color={this.useTheme('#303030', '#fbfbfb')} size={28} />
          </TouchableOpacity>
        </Animated.View>
      )
    else
      return null
  }
  renderUndoMessage() {
    return (
      <View style={[styles.undoView, {
        bottom: this.props.showUndoDelete ? 24.5 : -100,
        backgroundColor: this.useTheme('#303030', '#f5f5f5')
      }]}>
        <Text style={{ fontSize: 15, color: this.useTheme('#fbfbfb', '#303030'), fontFamily: 'SourceSansPro-Regular' }}>1 {translate('components.undoModal.deleted')}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ alignItems: 'center', justifyContent: 'center', padding: 6, borderRadius: 6 }}
          onPress={() => {
            this.props.restoreLastDeletedEmployee()
          }}
        >
          <Text style={{ fontSize: 17, fontFamily: 'SourceSansPro-SemiBold', color: '#008ee0' }}>
            {translate('components.undoModal.undo')}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  render() {
    { this.checkActiveSortLabel() }
    return (
      <View style={{
        ...styles.container,
        backgroundColor: this.useTheme('#f5f5f5', '#161616')
      }}>
        <View style={{ flex: 1 }}>
          {this.checkExit()}
          {this.renderUndoMessage()}
          <SortChoicesModal
            theme={this.props.theme}
            label="Sort By"
            choices={this.sortChoices}
            visible={this.state.sortChoicesModalVisible}
            selectedChoice={this.activeSortLabel}
            onSelect={this.onSelectSortChoice}
            onCancel={this.closeSortChoicesModal}
          />
          <View style={{
            ...styles.header,
            backgroundColor: this.useTheme('#f5f5f5', '#161616')
          }}>
            <View style={{
              ...styles.titleContainer,
              backgroundColor: this.useTheme('#f5f5f5', '#161616')
            }}>
              <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
                {translate('main.employeesList.title')}
              </Text>
            </View>
            {this.renderSortButton()}
          </View>
          <View style={{
            ...styles.searchView,
            backgroundColor: this.useTheme('#f9f9f9', '#242424')
          }}>
            <Icon
              name='md-search'
              style={{
                color: this.props.fetchingEmployees || !this.props.allEmployees.length ?
                  this.useTheme('#999', '#777')
                  :
                  this.useTheme('#606060', '#fbfbfb'),
                fontSize: 26
              }}
            />
            <TextInput
              editable={this.props.fetchingEmployees || !this.props.allEmployees.length ? false : true}
              value={this.state.searchWord}
              style={{
                ...styles.input,
                color: this.useTheme('#303030', '#fbfbfb'),
                textAlign: isRTL() ? 'right' : 'left'
              }}
              placeholderTextColor={this.useTheme('#999', 'rgba(255, 255, 255, 0.6)')}
              placeholder={translate('main.employeesList.placeholder')}
              onChangeText={this.changeSearchWord}
            />
            <Animated.View style={{
              opacity: this.clearIconOpacity,
              transform: [{ rotate: this.clearIconAngle }],
              position: 'absolute',
              right: 12
            }}>
              <TouchableOpacity activeOpacity={1} onPress={() => this.changeSearchWord('')}>
                <MaterialIcons
                  name='clear'
                  style={{
                    color: this.props.fetchingEmployees || !this.props.allEmployees.length ?
                      this.useTheme('#999', '#777')
                      :
                      this.useTheme('#606060', '#fbfbfb'),
                    fontSize: 24
                  }}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
          {this.renderScreen()}
          <TouchableOpacity
            disabled={this.state.isAddButtonDisabled}
            activeOpacity={1}
            style={styles.addButton}
            onPress={() => {
              this.setState({ isAddButtonDisabled: true })
              setTimeout(() => {
                this.setState({ isAddButtonDisabled: false })
              }, 180);
              Navigation.push(this.props.componentId, {
                component: {
                  name: 'employeeAdd',
                  options: {
                    animations: {
                      // push: {
                      //   waitForRender: true
                      // }
                    }
                  }
                }
              })
            }}
          >
            <Icon name='ios-add' style={{ color: '#f5f5f5', fontSize: 38 }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:
      Dimensions.get('window').width > 800 ? 62
        :
        Dimensions.get('window').width > 700 ? 48
          :
          Dimensions.get('window').width > 600 ? 36
            :
            Dimensions.get('window').width > 500 ? 10
              :
              0
  },
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical:
      Dimensions.get('window').width > 800 ? 20
        :
        Dimensions.get('window').width > 700 ? 12
          :
          Dimensions.get('window').width > 600 ? 8
            :
            Dimensions.get('window').width > 500 ? 6
              :
              2
  },
  titleContainer: {
    width: 300,
    paddingHorizontal: 12,
    justifyContent: 'center'
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
    justifyContent: 'center',
    elevation: 4
  },
  undoView: {
    height: 46,
    left: 14,
    right: 88,
    zIndex: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 6
  },
  searchView: {
    marginHorizontal: 5,
    marginBottom: 20,
    marginTop: 10,
    paddingRight: 10,
    paddingLeft: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    elevation: 2
  },
  input: {
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    fontSize: 17,
    fontFamily: 'SourceSansPro-Regular',
    marginLeft: 8,
    paddingTop: 0,
    paddingBottom: 0
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
    showUndoDelete: state.employees.showUndoDelete,
    exitCount: state.app.exitCount,
    theme: state.app.theme
  }
}

export default connect(mapStateToProps, mapDispatchToProp)(EmployeesListScreen)