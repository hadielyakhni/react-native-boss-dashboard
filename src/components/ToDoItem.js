import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation,
  UIManager,
  Dimensions
} from 'react-native'
import { Icon } from 'native-base'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { deleteTask, updateTask } from '../actions'
import { CheckBox } from 'react-native-elements'

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

class ToDoItem extends PureComponent {
  onBoxPress() {
    const { task, description, isDone } = this.props.data
    this.props.updateTask(this.props.taskId, task, description, isDone)
  }
  onDelete() {
    this.props.deleteTask(this.props.taskId)
    LayoutAnimation.configureNext({
      duration: 100,
      update: {
        type: LayoutAnimation.Types.easeOut,
        property: LayoutAnimation.Properties.opacity
      }
    })
  }
  render() {
    const { task, description, isDone } = this.props.data
    console.log('data: ', task, description, isDone)
    console.log('taskId: ', this.props.taskId)
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={() => {
          Navigation.push(this.props.componentId, {
            component: {
              name: 'todoDetails',
              passProps: {
                taskId: this.props.taskId,
                task,
                description,
                isDone
              },
              options: {
                topBar: {
                  title: { text: 'Task Details' },
                  backButton: { color: '#fff' }
                },
                animations: {
                  push: {
                    content: {
                      translationX: {
                        from: Dimensions.get('window').width,
                        to: 0,
                        duration: 100
                      }
                    }
                  }
                }
              }
            }
          })
        }}
      >
        <View style={styles.firstContainer}>
          <CheckBox
            containerStyle={styles.CheckBoxContainer}
            checked={this.props.data.isDone}
            onPress={this.onBoxPress.bind(this)}
            size={22}
            uncheckedColor='#ff006a'
          />
          <Text style={styles.taskTitle}>
            {this.props.data.task}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.secondContainer}
          onPress={this.onDelete.bind(this)}
        >
          <Icon
            name='ios-trash'
            style={styles.trashStyle}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    height: 40
  },
  firstContainer: {
    flexDirection: 'row',
    alignContent: 'center'
  },
  secondContainer: {
    justifyContent: 'center',
    paddingHorizontal: 8,
    height: 33
  },
  CheckBoxContainer: {
    paddingHorizontal: 5,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  taskTitle: {
    borderColor: '#121212',
    borderWidth: 1,
    alignSelf: 'center',
    fontSize: 16.6,
    color: '#f5f5f5'
  },
  trashStyle: {
    fontSize: 26,
    color: '#e3e3e3'
  },
  dialogStyle: {
    height: 220,
    width: 375,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 220
  }
})

const mapDispatchToProps = dispatch => ({
  deleteTask: taskId => dispatch(deleteTask(taskId)),
  updateTask: (taskId, task, description, isDone) => dispatch(updateTask(taskId, task, description, isDone))
})

export default connect(null, mapDispatchToProps)(ToDoItem) 