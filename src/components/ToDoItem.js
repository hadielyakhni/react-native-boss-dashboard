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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'
import { deleteTask, updateTask } from '../actions'
import { CheckBox } from 'react-native-elements'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { isRTL } from '../utils/i18n'
import Interactable from 'react-native-interactable'

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

class ToDoItem extends PureComponent {
  constructor(props) {
    super(props)
    super(props);
    this._deltaX = new Animated.Value(0);
    this.state = { isDone: this.props.data.isDone, isMoving: false, position: 1 };
  }
  componentDidMount() {
    LayoutAnimation.configureNext({
      update: {
        duration: 180,
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
      }
    })
  }
  componentWillUnmount() {
    LayoutAnimation.configureNext({
      update: {
        duration: 80,
        delay: 180,
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
  onSnap({ nativeEvent }) {
    const { index } = nativeEvent;
    this.setState({ position: index });
  }
  onDrag({ nativeEvent }) {
    const { state } = nativeEvent;
    if (state === 'start') {
      this.setState({ isMoving: true });
    }
  }
  onStopMoving() {
    this.setState({ isMoving: false });
  }
  onPress = () => {
    const { task, description, isDone, date, customDate } = this.props.data
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
              waitForRender: true
            }
          }
        }
      }
    })
  }
  render() {
    return (
      <View style={{
        marginVertical: 5,
        justifyContent: 'center'
      }}>
        <View style={styles.deleteIconContainer}>
          <TouchableOpacity activeOpacity={0.88} onPress={this.onDelete.bind(this)}>
            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#f9f9f9" />
          </TouchableOpacity>
        </View>
        <Interactable.View
          ref={el => this.interactableElem = el}
          horizontalOnly={true}
          snapPoints={[
            { x: 0, damping: 0.55, tension: 400 },
            { x: isRTL() ? 50 : -50, damping: 0.55, tension: 400 }
          ]}
          boundaries={{ [isRTL() ? 'left' : 'right']: 0 }}
          onSnap={this.onSnap.bind(this)}
          onDrag={this.onDrag.bind(this)}
          onStop={this.onStopMoving.bind(this)}
          dragToss={0.01}
          animatedValueX={this._deltaX}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.onPress}
            disabled={this.props.activeScreenName === 'todoDetails'}
          >
            <View style={{
              height: 40,
              backgroundColor: 'blue',
              backgroundColor: this.props.theme === 'light' ? '#f9f9f9' : '#242424',
              borderRadius: 7,
              borderTopWidth: this.props.theme === 'light' ? 0.7 : 0,
              borderLeftWidth: this.props.theme === 'light' ? 1.05 : 0,
              borderWidth: this.props.theme === 'light' ? 1.05 : 0,
              borderBottomWidth: this.props.theme === 'light' ? 1.4 : 0,
              borderColor: this.props.theme === 'light' ? '#eee' : null
            }}>
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
            </View>
          </TouchableOpacity>
        </Interactable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  firstContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  CheckBoxContainer: {
    paddingTop: 11.5,
    paddingLeft: 0,
    paddingRight: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 15
  },
  taskTitle: {
    fontSize: 18.5,
    width: Dimensions.get('window').width,
    fontFamily: 'SourceSansPro-Regular',
    textAlign: 'left'
  },
  deleteIconContainer: {
    width: 50,
    position: 'absolute',
    borderRadius: 8,
    right: 0,
    height: 37,
    justifyContent: 'center',
    backgroundColor: 'red',
    alignItems: 'center'
  }
})

const mapDispatchToProps = dispatch => ({
  deleteTask: (taskId, fromWichScreen, componentId, taskData) => dispatch(deleteTask(taskId, fromWichScreen, componentId, taskData)),
  updateTask: (taskId, task, description, isDone) => dispatch(updateTask(taskId, task, description, isDone))
})

export default connect(({ app }) =>
  ({ activeScreenName: app.activeScreenName }),
  mapDispatchToProps)(gestureHandlerRootHOC(ToDoItem)) 