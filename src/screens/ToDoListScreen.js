import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, TextInput, FlatList, ScrollView, Dimensions, Animated, BackHandler } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { addTask, fetchTasks, changeTasksSortData, restoreLastDeletedTask, incrementExitCount, resetExitCount } from '../actions'
import { Icon } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import ToDoItem from '../components/ToDoItem'
import SortChoicesModal from '../components/SortChoicesModal'
import ToDoLoadingContainer from '../components/ToDoLoadingContainer'

class ToDoListScreen extends Component {
  constructor(props) {
    super(props)
    this.navigationListner = Navigation.events().registerComponentDidAppearListener(data => {
      this.activeScreenName = data.componentName
    })
    this.props.fetchTasks()
    this.state = { task: '', sortChoicesModalVisible: false, clickCount: 0 }
    this.dataAppearsAtLeastOnce = false
    this.sortChoices = [{ id: '1', prop: 'time' }, { id: "2", prop: 'title' }]
    this.hintOpacityValue = 0
    this.hintOpacity = new Animated.Value(0)
    this.hintOpacity.addListener(({ value }) => this.hintOpacityValue = value)
    this.hintTranslateY = this.hintOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [90, 0]
    })
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
      outputRange: [0, 3.14]
    })
    this.doneListOpacityValue = 0
    this.doneListOpacity = new Animated.Value(0)
    this.doneListOpacity.addListener(({ value }) => this.doneListOpacityValue = value)
    this.lastDoneListArrowDiewction = 'down'
    this.doneArrowRotationAngle = this.doneListOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 3.14]
    })
    this.sortOpacity = this.hintOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    })
  }
  componentDidMount() {
    this.backButtonListner = BackHandler.addEventListener("hardwareBackPress", () => {
      const screen = this.activeScreenName
      if (screen === 'todo' || screen === 'employees' || screen === 'money') {
        this.props.incrementExitCount()
        return true
      }
    })
  }
  componentWillUnmount() {
    this.navigationListner.remove()
    this.hintOpacity.removeAllListeners()
    this.undoneOpacity.removeAllListeners()
    this.doneOpacity.removeAllListeners()
    this.undoneListOpacity.removeAllListeners()
    this.doneListOpacity.removeAllListeners()
    this.backButtonListner.remove()
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
      duration: 300
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
    if (this.doneListOpacityValue === 1 || (this.lastDoneListArrowDiewction === 'down' && this.doneListOpacityValue !== 0))
      toValue = 0
    if (this.doneListOpacityValue === 0 || (this.lastDoneListArrowDiewction === 'up' && this.doneListOpacityValue !== 1))
      toValue = 1
    Animated.timing(this.doneListOpacity, {
      toValue,
      duration: 300
    }).start()
    setTimeout(() => {
      if (this.lastDoneListArrowDiewction === 'up')
        this.lastDoneListArrowDiewction = 'down'
      else
        this.lastDoneListArrowDiewction = 'up'
    }, 300)
  }
  rendertask({ item }) {
    return (
      <ToDoItem
        componentId={this.props.componentId}
        taskId={item[0]}
        data={item[1]}
      />
    )
  }
  renderScreen() {
    if (!this.props.fetchingTasks)
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
          <ScrollView>
            {
              this.props.unDoneTasks.length ?
                <Animated.View style={{ opacity: this.undoneOpacity }}>
                  <TouchableOpacity activeOpacity={1} onPress={this.handleUndoneOpacity.bind(this)}>
                    <View style={styles.separotorView}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.separotorText}>
                          {'INCOMPLETED' + "  "}
                        </Text>
                        <Text style={styles.SeparatorNumber}>
                          ({this.props.unDoneTasks.length})
                        </Text>
                      </View>
                      <Animated.View style={{ transform: [{ rotate: this.undoneArrowRotationAngle }] }}>
                        <Ionicons name="ios-arrow-down" size={22} color="#eee" />
                      </Animated.View>
                    </View>
                  </TouchableOpacity>
                  <Animated.View style={{
                    opacity: this.undoneListOpacity,
                    height: this.undoneListOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 50 * this.props.unDoneTasks.length + 10]
                    })
                  }}>
                    <FlatList
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
                <Animated.View style={{ marginTop: 6, opacity: this.doneOpacity }}>
                  <TouchableOpacity activeOpacity={1} onPress={this.handleDoneOpacity.bind(this)}>
                    <View style={styles.separotorView}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.separotorText}>
                          {'COMPLETED' + "  "}
                        </Text>
                        <Text style={styles.SeparatorNumber}>
                          ({this.props.doneTasks.length})
                        </Text>
                      </View>
                      <Animated.View style={{ transform: [{ rotate: this.doneArrowRotationAngle }] }}>
                        <Ionicons name="ios-arrow-down" size={22} color="#eee" />
                      </Animated.View>
                    </View>
                  </TouchableOpacity>
                  <Animated.View style={{
                    opacity: this.doneListOpacity,
                    height: this.doneListOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 50 * this.props.doneTasks.length + 10]
                    })
                  }}>
                    <FlatList
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
            duration: 375,
            useNativeDriver: true
          }).start()
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
            <Animated.View style={{
              opacity: this.hintOpacity, alignItems: 'center',
              transform: [{ translateY: this.hintTranslateY }],
              marginBottom: 140
            }}>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 5 }}>Start organizing your life!</Text>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-Regular', fontSize: 15 }}>Any thing to do?</Text>
            </Animated.View>
          </View>
        )
      }
    return <ToDoLoadingContainer />
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
            style={{ width: 40, paddingLeft: 8, justifyContent: 'center' }}
            onPress={() => this.setState({ sortChoicesModalVisible: true })}
          >
            <MaterialCommunityIcons name="sort" color="#fff" size={28} />
          </TouchableOpacity>
        </Animated.View>
      )
    else return null
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
            this.props.restoreLastDeletedTask()
          }}
        >
          <Text style={{ fontSize: 17, fontFamily: 'SourceSansPro-SemiBold', color: '#008ee0' }}>
            Undo
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  checkExit() {
    if (this.props.exitCount === 0)
      return null
    if (this.props.exitCount === 1) {
      return <View style={{
        borderRadius: 16,
        height: 38,
        width: 190,
        backgroundColor: '#555',
        position: 'absolute',
        zIndex: 1,
        bottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
      }}>
        <Text style={{ fontSize: 15, color: '#ffffff', fontFamily: 'SourceSansPro-Regular' }}>Press again to exit...</Text>
      </View>
    }
    else if (this.props.exitCount === 2)
      BackHandler.exitApp()
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderUndoMessage()}
        {this.checkExit()}
        <SortChoicesModal
          choices={this.sortChoices}
          visible={this.state.sortChoicesModalVisible}
          selectedChoice={this.props.sortBy}
          onSelect={this.onSelectSortChoice}
          onCancel={this.closeSortChoicesModal}
        />
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 26, fontFamily: 'SourceSansPro-SemiBold' }}>
              My Tasks
            </Text>
          </View>
          {this.renderSortButton()}
        </View>
        <View style={styles.addView}>
          <TextInput
            editable={this.props.fetchingTasks ? false : true}
            value={this.state.task}
            style={styles.input}
            placeholderTextColor='rgba(255, 255, 255, 0.7)'
            placeholder='Quick Task'
            selectionColor='#008ee0'
            onChangeText={task => this.setState({ task })}
            onSubmitEditing={this.onAdd.bind(this)}
          />
          <TouchableOpacity
            disabled={!this.state.task.trim()}
            activeOpacity={0.85}
            style={this.state.task.trim() ? styles.iconView : { ...styles.iconView, borderColor: 'grey' }}
            onPress={this.onAdd.bind(this)}
          >
            <Icon
              name='md-add-circle'
              style={this.state.task.trim() ? styles.addIcon : { ...styles.addIcon, color: 'grey' }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 6, flex: 1 }}>
          {this.renderScreen()}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.addButton}
            onPress={() => (
              Navigation.push(this.props.componentId, {
                component: {
                  name: 'todoAdd',
                  options: {
                    animations: {
                      push: {
                        content: {
                          waitForRender: true,
                          translationY: {
                            from: Dimensions.get('window').height,
                            to: 0,
                            duration: 200
                          }
                        }
                      }
                    }
                  }
                }
              })
            )}
          >
            <Icon name='ios-add' style={{ color: '#fff', fontSize: 38 }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#000'
  },
  loadingContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#555'
  },
  header: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#000'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingTop: 8,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  addView: {
    marginBottom: 14,
    paddingHorizontal: 10,
    marginTop: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    height: 46
  },
  input: {
    marginRight: 10,
    borderRadius: 10,
    flex: 1,
    fontSize: 17,
    fontFamily: 'SourceSansPro-Regular',
    color: '#e3e3e3',
    alignItems: 'center'
  },
  addIcon: {
    fontSize: 30,
    color: '#e3e3e3'
  },
  iconView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    height: 29,
    width: 29,
    borderRadius: 14.5
  },
  addButton: {
    position: 'absolute',
    right: 9,
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
    color: '#eee',
    fontFamily: 'SourceSansPro-SemiBold'
  },
  SeparatorNumber: {
    color: '#eee',
    fontFamily: 'SourceSansPro-SemiBold'
  }
})

const mapActionsToProps = dispatch => ({
  addTask: newTask => dispatch(addTask(newTask)),
  fetchTasks: () => dispatch(fetchTasks()),
  changeTasksSortData: (sortBy, sortOrder) => dispatch(changeTasksSortData(sortBy, sortOrder)),
  restoreLastDeletedTask: () => dispatch(restoreLastDeletedTask()),
  incrementExitCount: () => dispatch(incrementExitCount()),
  resetExitCount: () => dispatch(resetExitCount())
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
    exitCount: state.exit.exitCount
  }
}

export default connect(mapStateToProps, mapActionsToProps)(gestureHandlerRootHOC(ToDoListScreen)) 