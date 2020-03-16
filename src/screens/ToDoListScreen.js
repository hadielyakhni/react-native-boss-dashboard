import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  LayoutAnimation,
  UIManager
} from 'react-native'
import { connect } from 'react-redux'
import { changeTask, addTask, fetchTasks } from '../actions'
import { Icon } from 'native-base'
import Spinner from 'react-native-spinkit'
import ToDoItem from '../components/ToDoItem'
import Separator from '../components/Separator'

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

class ToDoListScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { task: '' }
    this.props.fetchTasks()
  }
  onAdd() {
    LayoutAnimation.configureNext({
      duration: 400,
      update: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.75
      }
    })
    if (this.state.task !== '') {
      this.props.addTask(this.state.task)
      this.setState({ task: '' })
    }
  }
  rendertask(task) {
    return (
      <ToDoItem
        taskId={task.item[0]}
        task={task.item[1].task}
        isDone={task.item[1].isDone}
      />
    )
  }
  renderScreen() {
    if (!this.props.fetchingTasks)
      return (
        <ScrollView >
          <Separator text='INCOMPLETED' />
          <FlatList
            style={{ marginBottom: 10 }}
            data={this.props.unDoneTasks}
            keyExtractor={task => task[0]}
            renderItem={this.rendertask}
          />
          <Separator text='COMPLETED' />
          <FlatList
            data={this.props.doneTasks}
            keyExtractor={task => task[0]}
            renderItem={this.rendertask}
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
        <View style={styles.addView}>
          <TextInput
            editable={this.props.fetchingTasks ? false : true}
            value={this.state.task}
            style={styles.input}
            placeholderTextColor='rgba(255, 255, 255, 0.6)'
            placeholder='Add Task'
            selectionColor={'red'}
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
        {this.renderScreen()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
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
    marginHorizontal: 4,
    fontSize: 16,
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
    doneTasks = result.filter(task => task[1].isDone)
    unDoneTasks = result.filter(task => !task[1].isDone)
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