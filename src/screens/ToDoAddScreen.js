import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Keyboard, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { addTask } from '../actions'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MyButton from '../components/MyButton'

class ToDoAddScreen extends Component {
  state = {
    task: '',
    description: '',
    isKeyboardOpened: false
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow = () => {
    this.setState({ isKeyboardOpened: true })
  }
  _keyboardDidHide = () => {
    this.setState({ isKeyboardOpened: false })
  }
  isAddDisabled() {
    const { task } = this.state
    if (!task)
      return true
    return false
  }
  render() {
    return (
      <KeyboardAvoidingView behavior={"padding"} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => Navigation.pop(this.props.componentId)} style={styles.backIconContainer}>
            <Ionicons name="md-arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={{ color: '#fff', fontSize: 25, fontFamily: 'SourceSansPro-SemiBold' }}>
              Add Task
              </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 12, flex: 1 }}>
          <View>
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
              disabled={this.isAddDisabled()}
              disabledColor='#355973'
              style={[styles.addButton, { marginBottom: this.state.isKeyboardOpened ? 40 : 0 }]}
              textStyle={{ fontSize: 18 }}
              color='#008ee0'
              onPress={() => {
                const { task, description } = this.state
                this.props.addTask(task, description, 'todoAdd', this.props.componentId)
              }}
            >Add</MyButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  header: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#000',
    marginBottom: 15,
    paddingHorizontal: 4
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
  addButtonView: {
    height: 125,
    justifyContent: 'center'
  },
  addButton: {
    borderRadius: 10,
    height: 56
  }
})

const mapActionsToProps = dispatch => ({
  addTask: (task, description, fromWichScreen, componentId) => (
    dispatch(addTask(task, description, fromWichScreen, componentId)))
})

export default connect(null, mapActionsToProps)(ToDoAddScreen)