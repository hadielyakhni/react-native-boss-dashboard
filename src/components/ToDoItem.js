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
    const { task, description, isDone } = this.props.data
    this.props.updateTask(this.props.taskId, task, description, isDone)
  }
  onDelete() {
    this.props.deleteTask(this.props.taskId)
  }
  renderLeftActions(progress, dragX) {
    const arrowTranslateX = dragX.interpolate({
      inputRange: [0, 20, 125],
      outputRange: [0, 0, 75],
      extrapolate: 'clamp'
    })
    const backgroundColorOpacity = dragX.interpolate({
      inputRange: [0, 125],
      outputRange: [0.25, 1]
    })
    const arrowOpacity = dragX.interpolate({
      inputRange: [0, 100, 125],
      outputRange: [1, 0.75, 0],
      extrapolate: 'clamp'
    })
    const doneTranslateX = dragX.interpolate({
      inputRange: [0, 125],
      outputRange: [10, 20],
      extrapolate: 'clamp'
    })
    const doneOpacity = dragX.interpolate({
      inputRange: [0, 115, 125],
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
  renderRightActions(progress, dragX) {
    const arrowTranslateX = dragX.interpolate({
      inputRange: [-180, -20, 0],
      outputRange: [-120, 0, 0],
      extrapolate: 'clamp'
    })
    const backgroundColorOpacity = dragX.interpolate({
      inputRange: [-180, 0],
      outputRange: [1, 0.25]
    })
    const arrowOpacity = dragX.interpolate({
      inputRange: [-180, -132, 0],
      outputRange: [0, 0.75, 1],
      extrapolate: 'clamp'
    })
    const deleteTranslateX = dragX.interpolate({
      inputRange: [-180, 0],
      outputRange: [-20, -10],
      extrapolate: 'clamp'
    })
    const deleteOpacity = dragX.interpolate({
      inputRange: [-180, -170, 0],
      outputRange: [1, 0, 0]
    })
    return (
      <Animated.View style={{ flexDirection: 'row', backgroundColor: '#e65100', flex: 1, opacity: backgroundColorOpacity, height: 40, alignItems: 'center', justifyContent: 'flex-end' }}>
        <Animated.View style={{ position: 'absolute', opacity: arrowOpacity, transform: [{ translateX: arrowTranslateX }] }}>
          <MaterialIcons name="chevron-left" color="#fff" size={25} />
        </Animated.View>
        <Animated.View style={{ opacity: deleteOpacity, transform: [{ translateX: deleteTranslateX }], flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Text style={{ fontFamily: 'SourceSansPro-SemiBold', color: '#fff', fontSize: 16, marginRight: 7 }}>Delete</Text>
          <MaterialCommunityIcons name="trash-can-outline" color="#fff" size={25} />
        </Animated.View>
      </Animated.View>
    )
  }
  render() {
    const { task, description, isDone } = this.props
    return (
      <Swipeable
        containerStyle={{ marginVertical: 5, borderRadius: 4 }}
        renderLeftActions={this.renderLeftActions.bind(this)}
        leftThreshold={125}
        onSwipeableLeftOpen={this.onBoxPress.bind(this)}
        renderRightActions={this.renderRightActions.bind(this)}
        rightThreshold={180}
        onSwipeableRightOpen={this.onDelete.bind(this)}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
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
              checked={this.props.data.isDone}
              onPress={this.onBoxPress.bind(this)}
              size={22}
              uncheckedColor='#aaa'
            />
            <Text numberOfLines={1} style={styles.taskTitle}>
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
    fontSize: 18.5,
    color: '#f5f5f5',
    width: Dimensions.get('window').width - 115,
    textAlign: 'left',
    fontFamily: 'SourceSansPro-Regular'
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

export default connect(null, mapDispatchToProps)(gestureHandlerRootHOC(ToDoItem)) 