import React, { Component } from 'react'
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import { updateTask, deleteTask } from '../actions'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { translate, isRTL } from '../utils/i18n'

class ToDoDetailsScreen extends Component {
  constructor(props) {
    super(props)
    this.timeout = 0
    const { task, description, isDone, date } = this.props
    this.state = { task, description, isDone }
    this.taskData = { task, description, isDone, date }
  }
  useTheme(lightThemeColor, darkThemeColor) {
    if (this.props.theme === 'light')
      return lightThemeColor
    return darkThemeColor
  }
  taskTextChange(task) {
    this.setState({ task })
    if (this.timeout)
      clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const { task, description, isDone } = this.state
      this.props.updateTask(this.props.taskId, task, description, isDone, this.props.componentId, true)
    }, 300)
  }
  descriptionTextChange(description) {
    this.setState({ description })
    if (this.timeout)
      clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      const { task, description, isDone } = this.state
      this.props.updateTask(this.props.taskId, task, description, isDone, this.props.componentId, true)
    }, 300)
  }
  render() {
    return (
      <View
        style={{
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
            <Ionicons name={isRTL() ? "md-arrow-forward" : "md-arrow-back"} size={26} color={this.useTheme('#303030', '#fbfbfb')} />
          </TouchableOpacity>
          <View style={{
            ...styles.titleContainer,
            backgroundColor: this.useTheme('#f5f5f5', '#161616')
          }}>
            <Text numberOfLines={1} style={{ color: this.useTheme('#303030', '#fbfbfb'), fontSize: 25, fontFamily: 'SourceSansPro-SemiBold' }}>
              {translate('main.todoDetails.title')}
            </Text>
          </View>
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={0.2}
            onPress={() => this.props.deleteTask(this.props.taskId, 'todoDetails', this.props.componentId, this.taskData)}
          >
            <MaterialCommunityIcons name="trash-can-outline" color={this.useTheme('#303030', '#fbfbfb')} size={24} />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 8, flex: 1 }}>
          <View>
            <TextInput
              value={this.state.task}
              style={[styles.input, {
                borderTopWidth: 0.9,
                borderColor: this.useTheme('#999', 'rgba(255,255,255,0.1)'),
                borderBottomWidth: 0.9,
                color: this.useTheme('#303030', '#fbfbfb'),
                textAlign: isRTL() ? 'right' : 'left'
              }]}
              selectionColor='#008ee0'
              placeholder={translate('main.todoDetails.placeholder1')}
              placeholderTextColor={this.useTheme('#999', 'rgba(255,255,255,0.28)')}
              onChangeText={task => this.taskTextChange(task)}
            />
          </View>
          <View style={styles.descriptionContainer}>
            <TextInput
              multiline
              value={this.state.description}
              style={[styles.input, {
                color: this.useTheme('#303030', '#fbfbfb'),
                textAlignVertical: "top", flex: 1
              }]}
              selectionColor='#008ee0'
              placeholder={translate('main.todoDetails.placeholder2')}
              placeholderTextColor={this.useTheme('#999', 'rgba(255,255,255,0.28)')}
              onChangeText={description => this.descriptionTextChange(description)}
            />
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.92}
          style={{
            elevation: 3,
            backgroundColor: this.useTheme('#f5f5f5', '#222'),
            height: 52,
            marginBottom: 24,
            alignSelf: 'flex-end',
            borderRadius: 26,
            alignItems: 'center',
            marginRight: 9,
            justifyContent: 'center'
          }}
          onPress={() => {
            this.props.updateTask(this.props.taskId, null, null, this.state.isDone, this.props.componentId)
            Navigation.pop(this.props.componentId)
          }}
        >
          {
            !this.state.isDone ?
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 18 }}>
                <MaterialIcons name="done" color="#008ee0" size={25} style={{ marginRight: 5 }} />
                <Text style={{
                  marginLeft: 5,
                  fontFamily: 'SourceSansPro-SemiBold',
                  color: '#008ee0',
                  fontSize: 16
                }}>
                  {translate('main.todoDetails.markComplete')}
                </Text>
              </View>
              :
              <View style={{ paddingHorizontal: 18 }}>
                <MaterialCommunityIcons name="undo-variant" color="#008ee0" size={25} />
              </View>
          }
        </TouchableOpacity>
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
    paddingHorizontal: 4,
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
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
  }
})

const mapActionsToProps = dispatch => {
  return {
    updateTask: (taskId, task, description, isDone, componentId, isAuto) =>
      dispatch(updateTask(taskId, task, description, isDone, componentId, isAuto)),
    deleteTask: (taskId, fromWichScreen, componentId, taskData) =>
      dispatch(deleteTask(taskId, fromWichScreen, componentId, taskData))
  }
}

export default connect(
  ({ app }) => ({ theme: app.theme }),
  mapActionsToProps
)(ToDoDetailsScreen)