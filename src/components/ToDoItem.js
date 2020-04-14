import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  Animated,
  UIManager,
  Dimensions
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { deleteTask, updateTask } from '../actions'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { CheckBox } from 'react-native-elements'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

class ToDoItem extends PureComponent {
  state = { isDone: this.props.data.isDone }
  componentDidMount() {
    LayoutAnimation.configureNext({
      update: {
        duration: 200,
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      }
    })
  }
  componentWillUnmount() {
    LayoutAnimation.configureNext({
      update: {
        duration: 80,
        delay: 120,
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      }
    })
  }
  onBoxPress() {
    this.setState(prevState => ({ isDone: !prevState.isDone }))
    const { task, description, isDone } = this.props.data
    this.props.updateTask(this.props.taskId, task, description, isDone)
  }
  onDelete() {
    this.props.deleteTask(this.props.taskId, undefined, undefined, this.props.data)
  }
  renderLeftActions(progress, dragX) {
    const arrowTranslateX = dragX.interpolate({
      inputRange: [0, 20, 200],
      outputRange: [0, 0, 150],
      extrapolate: 'clamp'
    })
    const backgroundColorOpacity = dragX.interpolate({
      inputRange: [0, 200],
      outputRange: [0.25, 1]
    })
    const arrowOpacity = dragX.interpolate({
      inputRange: [0, 160, 200],
      outputRange: [1, 0.75, 0],
      extrapolate: 'clamp'
    })
    const doneTranslateX = dragX.interpolate({
      inputRange: [0, 200],
      outputRange: [10, 20],
      extrapolate: 'clamp'
    })
    const doneOpacity = dragX.interpolate({
      inputRange: [0, 185, 200],
      outputRange: [0, 0, 1]
    })
    return (
      !this.props.data.isDone ?
        <Animated.View style={{ flexDirection: 'row', backgroundColor: '#008ee0', flex: 1, opacity: backgroundColorOpacity, height: 40, alignItems: 'center' }}>
          <Animated.View style={{ position: 'absolute', opacity: arrowOpacity, transform: [{ translateX: arrowTranslateX }] }}>
            <MaterialIcons name="chevron-right" color="#fff" size={25} />
          </Animated.View>
          <Animated.View style={{ opacity: doneOpacity, transform: [{ translateX: doneTranslateX }], flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'SourceSansPro-SemiBold', color: '#fff', fontSize: 16, marginRight: 7 }}>Done</Text>
            <MaterialIcons name="done" color="#fff" size={25} />
          </Animated.View>
        </Animated.View>
        :
        null
    )
  }
  renderRightActions() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.onDelete.bind(this)}
        style={{ borderRadius: 8, flexDirection: 'row', backgroundColor: '#ef2e2e', height: 40, alignItems: 'center', justifyContent: 'flex-end' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 50 }}>
          <MaterialCommunityIcons name="trash-can-outline" color="#fff" size={24} />
        </View>
      </TouchableOpacity>
    )
  }
  render() {
    const { task, description, isDone, date, customDate } = this.props.data
    return (
      <Swipeable
        useNativeAnimations={true}
        containerStyle={{ marginVertical: 5, borderRadius: 8 }}
        renderLeftActions={this.renderLeftActions.bind(this)}
        leftThreshold={200}
        onSwipeableLeftWillOpen={this.onBoxPress.bind(this)}
        renderRightActions={this.renderRightActions.bind(this)}
      >
        <TouchableOpacity
          style={{ ...styles.container, backgroundColor: this.props.theme === 'light' ? '#f6f6f6' : '#242424' }}
          activeOpacity={1}
          onPress={() => {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'todoDetails',
                passProps: {
                  taskId: this.props.taskId,
                  task,
                  description,
                  isDone,
                  date,
                  customDate
                },
                options: {
                  animations: {
                    push: {
                      content: {
                        waitForRender: true,
                        translationX: {
                          from: Dimensions.get('window').width,
                          to: 0,
                          duration: 250
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
              checked={this.state.isDone}
              onPress={this.onBoxPress.bind(this)}
              size={22}
              uncheckedColor='#aaa'
            />
            <Text numberOfLines={1} style={{ ...styles.taskTitle, color: this.props.theme === 'light' ? '#303030' : '#fbfbfb' }}>
              {this.props.data.task}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    // elevation: 2,
    marginBottom: 2,
    marginHorizontal: 5
  },
  firstContainer: {
    flexDirection: 'row',
    elevation: 50,
    alignContent: 'center'
  },
  CheckBoxContainer: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  taskTitle: {
    paddingBottom: 2,
    textAlignVertical: 'center',
    fontSize: 18.5,
    width: Dimensions.get('window').width - 115,
    textAlign: 'left',
    fontFamily: 'SourceSansPro-Regular'
  }
})

const mapDispatchToProps = dispatch => ({
  deleteTask: (taskId, fromWichScreen, componentId, taskData) => dispatch(deleteTask(taskId, fromWichScreen, componentId, taskData)),
  updateTask: (taskId, task, description, isDone) => dispatch(updateTask(taskId, task, description, isDone))
})

export default connect(null, mapDispatchToProps)(gestureHandlerRootHOC(ToDoItem)) 