import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, Keyboard, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { addTask } from '../actions'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import MyButton from '../components/MyButton'

class ToDoAddScreen extends Component {
  state = {
    task: '',
    description: '',
    isKeyboardOpened: false,
    isAddButtonDisabled: false
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
    if (!task || this.state.isAddButtonDisabled)
      return true
    return false
  }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  render() {
    return (
      <KeyboardAvoidingView behavior={"padding"} style={{
        ...styles.container,
        backgroundColor: this.useTheme('#f5f5f5', '#161616')
      }}>
        <View style={{
          ...styles.header,
          backgroundColor: this.useTheme('#f5f5f5', '#161616')
        }}>
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{ bottom: 10, top: 10, left: 10, right: 10 }}
            style={{
              ...styles.backIconContainer,
              backgroundColor: this.useTheme('#f5f5f5', '#161616')
            }}
            onPress={() => Navigation.pop(this.props.componentId)}
          >
            <Ionicons name="md-arrow-back" size={26} color={this.useTheme('#303030', '#fbfbfb')} />
          </TouchableOpacity>
          <View style={{
            ...styles.titleContainer,
            backgroundColor: this.useTheme('#f5f5f5', '#161616')
          }}>
            <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 25, fontFamily: 'SourceSansPro-SemiBold' }}>
              Add Task
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 12, flex: 1 }}>
          <View>
            <TextInput
              value={this.state.task}
              style={[styles.input, {
                borderTopWidth: 0.9,
                borderColor: this.useTheme('#999', 'rgba(255,255,255,0.1)'),
                borderBottomWidth: 0.9,
                color: this.useTheme('#303030', '#fbfbfb')
              }]}
              selectionColor='#008ee0'
              placeholder="What would you like to do?"
              placeholderTextColor={this.useTheme('#999', 'rgba(255,255,255,0.28)')}
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
              style={[styles.input, {
                color: this.useTheme('#303030', '#fbfbfb'),
                textAlignVertical: "top",
                flex: 1
              }]}
              selectionColor='#008ee0'
              placeholder="Description"
              placeholderTextColor={this.useTheme('#999', 'rgba(255,255,255,0.28)')}
              onChangeText={description => this.setState({ description })}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.92}
            disabled={this.isAddDisabled()}
            style={{
              elevation: this.isAddDisabled() ? 2 : 4,
              backgroundColor: this.useTheme('#f5f5f5', '#222'),
              height: 52,
              marginBottom: this.state.isKeyboardOpened ? 44 : 24,
              alignSelf: 'flex-end',
              borderRadius: 26,
              alignItems: 'center',
              marginRight: 4,
              justifyContent: 'center'
            }}
            onPress={() => {
              this.setState({ isAddButtonDisabled: true })
              setTimeout(() => {
                this.setState({ isAddButtonDisabled: false })
              }, 300);
              const { task, description } = this.state
              this.props.addTask(task, description, 'todoAdd', this.props.componentId)
            }}
          >
            {
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 16 }}>
                <MaterialIcons name="done" color={this.isAddDisabled() ? this.useTheme('#afb8cb', '#777') : '#008ee0'} size={25} />
                <Text style={{
                  marginLeft: 5,
                  fontFamily: 'SourceSansPro-SemiBold',
                  color: this.isAddDisabled() ? this.useTheme('#afb8cb', '#777') : '#008ee0',
                  fontSize: 16.5
                }}>
                  Add
                </Text>
              </View>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView >
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
    marginVertical:
      Dimensions.get('window').width > 800 ? 20
        :
        Dimensions.get('window').width > 700 ? 12
          :
          Dimensions.get('window').width > 600 ? 8
            :
            Dimensions.get('window').width > 500 ? 6
              :
              2,
    marginBottom: 15,
    paddingHorizontal: 4
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center'
  },
  backIconContainer: {
    width: 42,
    justifyContent: 'center',
    alignItems: 'center'
  },
  descriptionContainer: {
    flex: 1
  },
  input: {
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

export default connect(
  ({ app }) => ({ theme: app.theme }),
  mapActionsToProps
)(ToDoAddScreen)