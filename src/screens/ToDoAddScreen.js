import React, { Component } from 'react'
import { View, StyleSheet, TextInput, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { addTask } from '../actions'
import MyButton from '../components/MyButton'

class ToDoAddScreen extends Component {
  state = {
    task: '',
    description: ''
  }
  render() {
    return (
      <View style={styles.container}>
        <View >
          <TextInput
            value={this.state.task}
            style={[styles.input, {
              borderTopWidth: 0.5,
              borderTopColor: '#575757',
              borderBottomWidth: 0.5,
              borderBottomColor: '#575757'
            }]}
            selectionColor='#008ee0'
            placeholder="What would you like to do?"
            placeholderTextColor="#575755"
            onChangeText={task => this.setState({ task })}
            onSubmitEditing={() => this.secondTextInput.focus()}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <TextInput
            multiline
            ref={input => this.secondTextInput = input}
            value={this.state.description}
            style={[styles.input, { textAlignVertical: "top", flex: 1 }]}
            selectionColor='#008ee0'
            placeholder="Description"
            placeholderTextColor="#575757"
            onChangeText={description => this.setState({ description })}
          />
        </View>
        <View style={styles.addButtonView}>
          <MyButton
            style={styles.addButton}
            color='#008ee0'
            onPress={() => {
              const { task, description } = this.state
              this.props.addTask(task, description, 'todoAdd', this.props.componentId)
            }}
          >Add</MyButton>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Dimensions.get('window').height / 30,
    paddingHorizontal: 12
  },
  descriptionContainer: {
    flex: 1
  },
  input: {
    color: '#fff',
    fontSize: 15,
    paddingLeft: 10
  },
  addButtonView: {
    height: 125,
    justifyContent: 'center'
  },
  addButton: {
    borderRadius: 10,
    height: 56,
    marginVertical: 0
  }
})

const mapActionsToProps = dispatch => ({
  addTask: (task, description, fromWichScreen, componentId) => (
    dispatch(addTask(task, description, fromWichScreen, componentId)))
})

export default connect(null, mapActionsToProps)(ToDoAddScreen)