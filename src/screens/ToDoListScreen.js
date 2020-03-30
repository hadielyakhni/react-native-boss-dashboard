import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { addTask, fetchTasks } from '../actions'
import { Icon } from 'native-base'
import Spinner from 'react-native-spinkit'
import ToDoItem from '../components/ToDoItem'
import Separator from '../components/Separator'


class ToDoListScreen extends Component {
  constructor(props) {
    super(props)
    console.log(this.props.componentId)
    this.state = { task: '' }
    this.props.fetchTasks()
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
      return (
        <ScrollView >
          <Separator text='INCOMPLETED' />
          <FlatList
            initialNumToRender={200}
            style={{ marginBottom: 10 }}
            data={this.props.unDoneTasks}
            keyExtractor={task => task[0]}
            renderItem={this.rendertask.bind(this)}
          />
          <Separator text='COMPLETED' />
          <FlatList
            data={this.props.doneTasks}
            keyExtractor={task => task[0]}
            renderItem={this.rendertask.bind(this)}
          />
        </ScrollView>
      )
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
    marginBottom: 20,
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