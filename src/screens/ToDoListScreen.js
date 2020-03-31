import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions,
  Animated
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { addTask, fetchTasks } from '../actions'
import { Icon } from 'native-base'
import ToDoItem from '../components/ToDoItem'
import Separator from '../components/Separator'

class ToDoListScreen extends Component {
  constructor(props) {
    super(props)
    console.log(this.props.componentId)
    this.state = { task: '' }
    this.props.fetchTasks()
    this.hintOpacityValue = 0
    this.hintOpacity = new Animated.Value(0)
    this.hintOpacity.addListener(({ value }) => this.hintOpacityValue = value)
    this.hintTranslateY = this.hintOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [40, -Dimensions.get('window').height / 12]
    })
    this.undoneOpacityValue = 0
    this.undoneOpacity = new Animated.Value(0)
    this.undoneOpacity.addListener(({ value }) => this.undoneOpacityValue = value)
    this.doneOpacityValue = 0
    this.doneOpacity = new Animated.Value(0)
    this.doneOpacity.addListener(({ value }) => this.doneOpacityValue = value)
  }
  componentWillUnmount() {
    this.hintOpacity.removeAllListeners()
    this.undoneOpacity.removeAllListeners()
    this.doneOpacity.removeAllListeners()
  }
  onAdd() {
    if (this.state.task !== '') {
      this.props.addTask(this.state.task)
      this.setState({ task: '' })
    }
  }
  rendertask(task) {
    return (
      <ToDoItem
        componentId={this.props.componentId}
        taskId={task.item[0]}
        data={task.item[1]}
      />
    )
  }
  renderScreen() {
    if (!this.props.fetchingTasks)
      if (!!this.props.unDoneTasks.length || !!this.props.doneTasks.length) {
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
                <Animated.View style={{ flex: 1, opacity: this.undoneOpacity }}>
                  <Separator text='INCOMPLETED' number={this.props.unDoneTasks.length} />
                  <FlatList
                    initialNumToRender={25}
                    style={{ marginBottom: 10 }}
                    data={this.props.unDoneTasks}
                    keyExtractor={task => task[0]}
                    renderItem={this.rendertask.bind(this)}
                  />
                </Animated.View>
                :
                null
            }
            {
              this.props.doneTasks.length ?
                <Animated.View style={{ flex: 1, opacity: this.doneOpacity }}>
                  <Separator text='COMPLETED' number={this.props.doneTasks.length} />
                  <FlatList
                    initialNumToRender={25}
                    data={this.props.doneTasks}
                    keyExtractor={task => task[0]}
                    renderItem={this.rendertask.bind(this)}
                    getItemLayout={(data, index) => (
                      { length: 50, offset: 50 * index, index }
                    )}
                  />
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
            <Animated.View style={{ opacity: this.hintOpacity, alignItems: 'center', transform: [{ translateY: this.hintTranslateY }] }}>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-SemiBold', fontSize: 17, marginBottom: 5 }}>Start organizing your life!</Text>
              <Text style={{ color: '#eee', fontFamily: 'SourceSansPro-Regular', fontSize: 15 }}>Any thing to do?</Text>
            </Animated.View>
          </View>
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
              My Tasks
            </Text>
          </View>
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
  }
})

const mapActionsToProps = dispatch => ({
  addTask: newTask => dispatch(addTask(newTask)),
  fetchTasks: () => dispatch(fetchTasks())
})

const mapStateToProps = ({ todo }) => {
  const tasks = todo.tasks
  let result, doneTasks, unDoneTasks
  if (tasks && tasks !== []) {
    result = Object.keys(tasks).map(key => [key, tasks[key]])
    doneTasks = result.filter(task => task[1].isDone).sort((task1, task2) => task2[1].date - task1[1].date)
    unDoneTasks = result.filter(task => !task[1].isDone).sort((task1, task2) => task2[1].date - task1[1].date)
  }
  else {
    doneTasks = []
    unDoneTasks = []
  }
  return {
    doneTasks,
    unDoneTasks,
    fetchingTasks: todo.fetchingTasks
  }
}

export default connect(mapStateToProps, mapActionsToProps)(ToDoListScreen) 