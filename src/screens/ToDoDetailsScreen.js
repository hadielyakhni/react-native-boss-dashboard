import React, { Component } from 'react'
import { View, StyleSheet, TextInput, Dimensions, Modal, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { updateTask, deleteTask } from '../actions'
import { Spinner } from 'native-base'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MyButton from '../components/MyButton'

class ToDoDetailsScreen extends Component {
  constructor(props) {
    super(props)
    const { task, description, isDone } = this.props
    this.state = { task, description, isDone }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => Navigation.pop(this.props.componentId)} style={styles.backIconContainer}>
            <Ionicons name="md-arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 25, fontFamily: 'SourceSansPro-SemiBold' }}>
              Task Details
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 8, flex: 1 }}>
          <View>
            <TextInput
              value={this.state.task}
              style={[styles.input, {
                borderTopWidth: 0.5,
                borderTopColor: '#575757',
                borderBottomWidth: 0.5,
                borderBottomColor: '#575757',
              }]}
              selectionColor='#008ee0'
              placeholder="What would you like to do?"
              placeholderTextColor="#575755"
              onChangeText={task => this.setState({ task })}
            />
          </View>
          <View style={styles.descriptionContainer}>
            <TextInput
              multiline
              value={this.state.description}
              style={[styles.input, { textAlignVertical: "top", flex: 1 }]}
              selectionColor='#008ee0'
              placeholder="Description"
              placeholderTextColor="#575757"
              onChangeText={description => this.setState({ description })}
            />
          </View>
          <View style={styles.buttonView}>
            <MyButton
              activeOpacity={0.9}
              style={{ height: 55 }}
              textStyle={{ fontSize: 20 }}
              color='#008ee0'
              onPress={() => {
                const { task, description, isDone } = this.state
                this.props.updateTask(this.props.taskId, task, description, isDone, this.props.componentId)
              }}
            >Save
          </MyButton>
            <MyButton
              activeOpacity={0.9}
              style={{ marginBottom: 20, height: 50 }}
              color='#e65100'
              textStyle={{ fontSize: 20 }}
              onPress={() => {
                this.props.deleteTask(this.props.taskId, 'todoDetails', this.props.componentId)
              }}
            >Delete
          </MyButton>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.props.deletingTask}>
              <View style={styles.loadingModalContainer} >
                <View style={styles.loadingModal}>
                  <Spinner color='#eeeeee' size={27} style={{ marginRight: 0 }} />
                  <Text style={{ color: '#eeeeee', fontSize: 17, fontFamily: 'SourceSansPro-Regular' }}>
                    Deleting...
                  </Text>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 4
  },
  header: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#000',
    marginBottom: 15
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  backIconContainer: {
    width: 42,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  descriptionContainer: {
    flex: 1
  },
  input: {
    color: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 17.8,
    fontFamily: 'SourceSansPro-Regular'
  },
  buttonView: {
    height: 150,
    justifyContent: 'space-evenly'
  },
  loadingModalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingModal: {
    borderRadius: 6,
    backgroundColor: '#171717',
    width: 140,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  }
})

const mapStateToProps = ({ todo }) => ({
  deletingTask: todo.deletingTask
})

const mapActionsToProps = dispatch => {
  return {
    updateTask: (taskId, task, description, isDone, componentId) => (
      dispatch(updateTask(taskId, task, description, isDone, componentId))
    ),
    deleteTask: (taskId, fromWichScreen, componentId) => (
      dispatch(deleteTask(taskId, fromWichScreen, componentId))
    )
  }
}

export default connect(mapStateToProps, mapActionsToProps)(ToDoDetailsScreen)