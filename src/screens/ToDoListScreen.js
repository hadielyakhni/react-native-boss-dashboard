import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, TextInput, FlatList, ScrollView, Dimensions, Animated, BackHandler } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import {
  addTask,
  fetchTasks,
  changeTasksSortData,
  restoreLastDeletedTask,
  resetExitCount,
  setActiveScreenName
} from '../actions'
import { Icon } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import ToDoItem from '../components/ToDoItem'
import SortChoicesModal from '../components/ChoicesModal'
import ToDoLoadingContainer from '../components/ToDoLoadingContainer'
import SplashScreen from 'react-native-splash-screen'
import { translate, isRTL } from '../utils/i18n'
import getNumber from '../utils/getNumber'

class ToDoListScreen extends Component {
  constructor(props) {
    super(props)
    if (!this.props.isFromAuth)
      setTimeout(() => {
        SplashScreen.hide()
      }, 75);
    this.state = {
      task: '',
      sortChoicesModalVisible: false,
      clickCount: 0,
      isAddButtonDisabled: false,
      canRender: true
    }
    this.activeScreenTabIndex = 0
    this.navigationListner1 = Navigation.events().registerComponentDidAppearListener(data => {
      this.props.setActiveScreenName(data.componentName)
      this.activeScreenName = data.componentName
      this.activeScreenId = data.componentId
    })
    this.navigationListner2 = Navigation.events().registerBottomTabPressedListener(e => {
      if (e.tabIndex !== this.activeScreenTabIndex)
        Navigation.mergeOptions(this.props.componentId, { bottomTabs: { currentTabIndex: e.tabIndex } })
      else if (
        this.activeScreenName !== 'todo'
        &&
        this.activeScreenName !== 'employees'
        &&
        this.activeScreenName !== 'money'
        &&
        this.activeScreenName !== 'settings'
      ) {
        Navigation.popToRoot(this.activeScreenId)
        const screenName = this.activeScreenTabIndex === 0 ?
          'todo' : this.activeScreenTabIndex === 1 ?
            'employees' : this.activeScreenTabIndex === 2 ?
              'money' : 'settings'
        this.props.setActiveScreenName(screenName)
      }
      this.activeScreenTabIndex = e.tabIndex
    })
    this.props.fetchTasks()
    this.dataAppearsAtLeastOnce = false
    this.sortChoices = [{ id: '1', prop: 'time' }, { id: "2", prop: 'title' }]
    this.hintOpacityValue = 0
    this.hintOpacity = new Animated.Value(0)
    this.hintOpacity.addListener(({ value }) => this.hintOpacityValue = value)
    this.undoneOpacityValue = 0
    this.undoneOpacity = new Animated.Value(0)
    this.undoneOpacity.addListener(({ value }) => this.undoneOpacityValue = value)
    this.doneOpacityValue = 0
    this.doneOpacity = new Animated.Value(0)
    this.doneOpacity.addListener(({ value }) => this.doneOpacityValue = value)
    this.undoneListOpacityValue = 1
    this.undoneListOpacity = new Animated.Value(1)
    this.undoneListOpacity.addListener(({ value }) => this.undoneListOpacityValue = value)
    this.lastUndoneListArrowDiewction = 'up'
    this.undoneArrowRotationAngle = this.undoneListOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"]
    })
    this.doneListOpacityValue = this.props.unDoneTasks.length ? 0 : 1
    this.doneListOpacity = new Animated.Value(this.props.unDoneTasks.length ? 0 : 1)
    this.doneListOpacity.addListener(({ value }) => this.doneListOpacityValue = value)
    this.lastDoneListArrowDirection = 'down'
    this.doneArrowRotationAngle = this.doneListOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"]
    })
    this.sortOpacity = this.hintOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })
  }
  componentWillUnmount() {
    this.navigationListner1.remove()
    this.navigationListner2.remove()
    this.hintOpacity.removeAllListeners()
    this.undoneOpacity.removeAllListeners()
    this.doneOpacity.removeAllListeners()
    this.undoneListOpacity.removeAllListeners()
    this.doneListOpacity.removeAllListeners()
  }
  onAdd() {
    if (this.state.task !== '') {
      this.props.addTask(this.state.task)
      this.setState({ task: '' })
    }
  }
  handleUndoneOpacity() {
    let toValue
    if (this.undoneListOpacityValue === 1 || (this.lastUndoneListArrowDiewction === 'down' && this.undoneListOpacityValue !== 0))
      toValue = 0
    if (this.undoneListOpacityValue === 0 || (this.lastUndoneListArrowDiewction === 'up' && this.undoneListOpacityValue !== 1))
      toValue = 1
    Animated.timing(this.undoneListOpacity, {
      toValue,
      duration: 300,
      useNativeDriver: false
    }).start()
    setTimeout(() => {
      if (this.lastUndoneListArrowDiewction === 'up')
        this.lastUndoneListArrowDiewction = 'down'
      else
        this.lastUndoneListArrowDiewction = 'up'
    }, 300)
  }
  handleDoneOpacity() {
    let toValue
    if (this.doneListOpacityValue === 1 || (this.lastDoneListArrowDirection === 'down' && this.doneListOpacityValue !== 0))
      toValue = 0
    if (this.doneListOpacityValue === 0 || (this.lastDoneListArrowDirection === 'up' && this.doneListOpacityValue !== 1))
      toValue = 1
    Animated.timing(this.doneListOpacity, {
      toValue,
      duration: 300,
      useNativeDriver: false
    }).start()
    setTimeout(() => {
      if (this.lastDoneListArrowDirection === 'up')
        this.lastDoneListArrowDirection = 'down'
      else
        this.lastDoneListArrowDirection = 'up'
    }, 300)
  }
  rendertask({ item }) {
    return (
      <ToDoItem
        theme={this.props.theme}
        componentId={this.props.componentId}
        taskId={item[0]}
        data={item[1]}
      />
    )
  }
  renderScreen() {
    if (!this.props.fetchingTasks && this.state.canRender)
      if (!!this.props.unDoneTasks.length || !!this.props.doneTasks.length) {
        if (!this.dataAppearsAtLeastOnce)
          this.dataAppearsAtLeastOnce = true
        if (this.hintOpacityValue !== 0)
          this.hintOpacity.setValue(0)
        if (!!this.props.unDoneTasks.length && this.undoneOpacityValue !== 1)
          Animated.timing(this.undoneOpacity, {
            toValue: 1,
            duration: 175,
            useNativeDriver: true
          }).start()
        if (!!this.props.doneTasks.length && this.doneOpacityValue !== 1)
          Animated.timing(this.doneOpacity, {
            toValue: 1,
            duration: 175,
            useNativeDriver: true
          }).start()
        if (!this.props.unDoneTasks.length && this.undoneOpacityValue !== 0)
          this.undoneOpacity.setValue(0)
        if (!this.props.doneTasks.length && this.doneOpacityValue !== 0)
          this.doneOpacity.setValue(0)
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              this.props.unDoneTasks.length ?
                <Animated.View style={{ marginTop: 3 }}>
                  <TouchableOpacity activeOpacity={1} onPress={this.handleUndoneOpacity.bind(this)}>
                    <View style={styles.separotorView}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...styles.separotorText, color: this.useTheme('#303030', '#fbfbfb') }}>
                          {translate('main.todoList.incompleted') + "  "}
                        </Text>
                        <Text style={{ ...styles.SeparatorNumber, color: this.useTheme('#303030', '#fbfbfb') }}>
                          ({getNumber(this.props.unDoneTasks.length.toString())})
                        </Text>
                      </View>
                      <Animated.View style={{ transform: [{ rotate: this.undoneArrowRotationAngle }] }}>
                        <Ionicons name="ios-arrow-down" size={22} color={this.useTheme('#303030', '#fbfbfb')} />
                      </Animated.View>
                    </View>
                  </TouchableOpacity>
                  <Animated.View style={{
                    height: this.undoneListOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 50 * this.props.unDoneTasks.length + 10]
                    })
                  }}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      initialNumToRender={200}
                      style={{ marginBottom: 10 }}
                      data={this.props.unDoneTasks}
                      keyExtractor={task => task[0]}
                      renderItem={this.rendertask.bind(this)}
                      getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
                    />
                  </Animated.View>
                </Animated.View>
                :
                null
            }
            {
              this.props.doneTasks.length ?
                <Animated.View style={{ marginTop: 3 }}>
                  <TouchableOpacity activeOpacity={1} onPress={this.handleDoneOpacity.bind(this)}>
                    <View style={styles.separotorView}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...styles.separotorText, color: this.useTheme('#303030', '#eee') }}>
                          {translate('main.todoList.completed') + "  "}
                        </Text>
                        <Text style={{ ...styles.SeparatorNumber, color: this.useTheme('#303030', '#eee') }}>
                          ({getNumber(this.props.doneTasks.length.toString())})
                        </Text>
                      </View>
                      <Animated.View style={{ transform: [{ rotate: this.doneArrowRotationAngle }] }}>
                        <Ionicons name="ios-arrow-down" size={22} color={this.useTheme('#303030', '#eee')} />
                      </Animated.View>
                    </View>
                  </TouchableOpacity>
                  <Animated.View style={{
                    height: this.doneListOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 50 * this.props.doneTasks.length + 10]
                    })
                  }}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      initialNumToRender={200}
                      style={{ marginBottom: 10 }}
                      data={this.props.doneTasks}
                      keyExtractor={task => task[0]}
                      renderItem={this.rendertask.bind(this)}
                      getItemLayout={(data, index) => (
                        { length: 50, offset: 50 * index, index }
                      )}
                    />
                  </Animated.View>
                </Animated.View>
                :
                null
            }
          </ScrollView>
        )
      }
      else {
        if (!this.props.unDoneTasks.length && this.undoneOpacityValue !== 0)
          this.undoneOpacity.setValue(0)
        if (!this.props.doneTasks.length && this.doneOpacityValue !== 0)
          this.doneOpacity.setValue(0)
        if (this.hintOpacityValue !== 1)
          Animated.timing(this.hintOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true
          }).start()
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <Animated.View style={{
              opacity: this.hintOpacity, alignItems: 'center',
              marginBottom: 140
            }}>
              <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 5 }}>
                {translate('main.todoList.hint1')}
              </Text>
              <Text style={{ color: this.useTheme('#303030', '#fbfbfb'), fontFamily: 'SourceSansPro-Regular', fontSize: 15 }}>
                {translate('main.todoList.hint2')}
              </Text>
            </Animated.View>
          </View>
        )
      }
    return <ToDoLoadingContainer theme={this.props.theme} />
  }
  closeSortChoicesModal = () => {
    this.setState({ sortChoicesModalVisible: false })
  }
  onSelectSortChoice = choice => {
    this.setState({ sortChoicesModalVisible: false })
    switch (choice) {
      case 'time':
        this.props.changeTasksSortData('time', 'desc')
        break
      case 'title':
        this.props.changeTasksSortData('title', 'asc')
    }
  }
  renderSortButton() {
    if ((!this.props.fetchingTasks && this.dataAppearsAtLeastOnce) || !!this.props.unDoneTasks.length || !!this.props.doneTasks.length)
      return (
        <Animated.View style={{ justifyContent: 'center', opacity: this.sortOpacity }}>
          <TouchableOpacity
            disabled={this.hintOpacityValue === 1}
            activeOpacity={0.8}
            style={{ width: 40, paddingHorizontal: 6, justifyContent: 'center' }}
            onPress={() => this.setState({ sortChoicesModalVisible: true })}
          >
            <MaterialCommunityIcons name="sort" color={this.useTheme('#303030', "#fbfbfb")} size={28} />
          </TouchableOpacity>
        </Animated.View>
      )
    else return null
  }
  renderUndoMessage() {
    return (
      <View style={[styles.undoView, {
        bottom: this.props.showUndoDelete ? 24.5 : -100,
        backgroundColor: this.useTheme('#303030', '#f5f5f5')
      }]}>
        <Text style={{ fontSize: 15, color: this.useTheme('#fbfbfb', '#303030'), fontFamily: 'SourceSansPro-Regular' }}>
          1 {translate('components.undoModal.deleted')}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ alignItems: 'center', justifyContent: 'center', padding: 6, borderRadius: 6 }}
          onPress={() => {
            this.props.restoreLastDeletedTask()
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
        <Text style={{ fontSize: 15, color: '#fbfbfb', fontFamily: 'SourceSansPro-Regular' }}>{translate('components.confirmExitModal.message')}</Text>
      </View>
    }
    else if (this.props.exitCount === 2)
      BackHandler.exitApp()
  }
  render() {
    if (this.props.doneTasks.length && !!this.props.unDoneTasks.length && !this.dataAppearsAtLeastOnce)
      this.doneListOpacity.setValue(0)
    return (
      <View style={{ ...styles.container, backgroundColor: this.useTheme('#f5f5f5', '#161616') }}>
        {this.renderUndoMessage()}
        {this.checkExit()}
        <SortChoicesModal
          theme={this.props.theme}
          label="Sort By"
          choices={this.sortChoices}
          visible={this.state.sortChoicesModalVisible}
          selectedChoice={this.props.sortBy}
          onSelect={this.onSelectSortChoice}
          onCancel={this.closeSortChoicesModal}
        />
        <View style={{ ...styles.header, backgroundColor: this.useTheme('#f5f5f5', '#161616') }}>
          <View style={{ ...styles.titleContainer, backgroundColor: this.useTheme('#f5f5f5', '#161616') }}>
            <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
              {translate('main.todoList.title')}
            </Text>
          </View>
          {this.renderSortButton()}
        </View>
        <View style={{ ...styles.addView, backgroundColor: this.useTheme('#f9f9f9', '#242424') }}>
          <TextInput
            editable={this.props.fetchingTasks ? false : true}
            value={this.state.task}
            style={{ ...styles.input, textAlign: isRTL() ? 'right' : 'left', color: this.useTheme('#303030', '#fbfbfb') }}
            placeholderTextColor={this.useTheme('#999', 'rgba(255, 255, 255, 0.6)')}
            placeholder={translate('main.todoList.placeholder')}
            selectionColor='#008ee0'
            onChangeText={task => this.setState({ task })}
            onSubmitEditing={this.onAdd.bind(this)}
            autoCapitalize="sentences"
          />
          <TouchableOpacity
            disabled={!this.state.task.trim()}
            activeOpacity={0.85}
            style={
              this.state.task.trim() ?
                {
                  ...styles.iconView,
                  backgroundColor: this.useTheme(null, null),
                  borderColor: this.useTheme('#303030', '#fbfbfb')
                }
                :
                {
                  ...styles.iconView,
                  backgroundColor: this.useTheme(null, null),
                  borderColor: this.useTheme('#ddd', 'grey')
                }
            }
            onPress={this.onAdd.bind(this)}
          >
            <Icon
              name='md-add-circle'
              style={this.state.task.trim() ?
                { ...styles.addIcon, color: this.useTheme('#303030', '#fbfbfb') } :
                { ...styles.addIcon, color: this.useTheme('#ddd', 'grey') }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 6, flex: 1 }}>
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
                  name: 'todoAdd',
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
  addView: {
    marginHorizontal: 5,
    marginBottom: 14,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    elevation: 2
  },
  input: {
    marginRight: 10,
    borderRadius: 10,
    flex: 1,
    fontSize: 17,
    fontFamily: 'SourceSansPro-Regular',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0
  },
  addIcon: {
    fontSize: 30
  },
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 29,
    width: 29,
    borderRadius: 14.5
  },
  addButton: {
    elevation: 4,
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
    left:
      Dimensions.get('window').width > 800 ? 76
        :
        Dimensions.get('window').width > 700 ? 62
          :
          Dimensions.get('window').width > 600 ? 50
            :
            Dimensions.get('window').width > 500 ? 24
              :
              14,
    right:
      Dimensions.get('window').width > 800 ? 150
        :
        Dimensions.get('window').width > 700 ? 136
          :
          Dimensions.get('window').width > 600 ? 124
            :
            Dimensions.get('window').width > 500 ? 98
              :
              88,
    zIndex: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 6
  },
  separotorView: {
    marginHorizontal: 4,
    marginBottom: 10,
    marginTop: 8,
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  separotorText: {
    fontSize: 14.5,
    fontFamily: 'SourceSansPro-SemiBold'
  },
  SeparatorNumber: {
    fontFamily: 'SourceSansPro-SemiBold'
  }
})

const mapActionsToProps = dispatch => ({
  addTask: newTask => dispatch(addTask(newTask)),
  fetchTasks: () => dispatch(fetchTasks()),
  changeTasksSortData: (sortBy, sortOrder) => dispatch(changeTasksSortData(sortBy, sortOrder)),
  restoreLastDeletedTask: () => dispatch(restoreLastDeletedTask()),
  resetExitCount: () => dispatch(resetExitCount()),
  setActiveScreenName: screenName => dispatch(setActiveScreenName(screenName))
})

const mapStateToProps = (state) => {
  const { tasks, sortBy, sortOrder } = state.todo
  let result, doneTasks, unDoneTasks
  if (tasks && tasks !== [] && sortBy && sortOrder) {
    result = Object.keys(tasks).map(key => [key, tasks[key]])
    if (sortBy === 'title')
      if (sortOrder === 'asc') {
        doneTasks = result.filter(task => task[1].isDone).sort((a, b) => (a[1].task.toLowerCase() > b[1].task.toLowerCase()) ? 1 : ((b[1].task.toLowerCase() > a[1].task.toLowerCase()) ? -1 : 0))
        unDoneTasks = result.filter(task => !task[1].isDone).sort((a, b) => (a[1].task.toLowerCase() > b[1].task.toLowerCase()) ? 1 : ((b[1].task.toLowerCase() > a[1].task.toLowerCase()) ? -1 : 0))
      }
      else {
        doneTasks = result.filter(task => task[1].isDone).sort((a, b) => (a[1].task.toLowerCase() > b[1].task.toLowerCase()) ? -1 : ((b[1].task.toLowerCase() > a[1].task.toLowerCase()) ? 1 : 0))
        unDoneTasks = result.filter(task => !task[1].isDone).sort((a, b) => (a[1].task.toLowerCase() > b[1].task.toLowerCase()) ? -1 : ((b[1].task.toLowerCase() > a[1].task.toLowerCase()) ? 1 : 0))
      }
    if (sortBy === 'time')
      if (sortOrder === 'asc') {
        doneTasks = result.filter(task => task[1].isDone).sort((a, b) => a[1].date - b[1].date)
        unDoneTasks = result.filter(task => !task[1].isDone).sort((a, b) => a[1].date - b[1].date)
      }
      else {
        doneTasks = result.filter(task => task[1].isDone).reverse().sort((a, b) => b[1].date - a[1].date)
        unDoneTasks = result.filter(task => !task[1].isDone).reverse().sort((a, b) => b[1].date - a[1].date)
      }
  }
  else {
    doneTasks = []
    unDoneTasks = []
  }
  return {
    doneTasks,
    unDoneTasks,
    sortBy,
    sortOrder,
    fetchingTasks: state.todo.fetchingTasks,
    showUndoDelete: state.todo.showUndoDelete,
    theme: state.app.theme
  }
}

export default connect(mapStateToProps, mapActionsToProps)(gestureHandlerRootHOC(ToDoListScreen))