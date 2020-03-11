import React, { PureComponent } from 'react'
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation,
  UIManager
} from 'react-native'
import { Icon } from 'native-base'
import { connect } from 'react-redux'
import Dialog, {
  SlideAnimation,
  DialogContent,
  DialogFooter,
  DialogButton
} from 'react-native-popup-dialog'
import { deleteTask, updateTask } from '../actions'
import { CheckBox } from 'react-native-elements'

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

class ToDoItem extends PureComponent {
  state = {
    task: this.props.task,
    isChecked: this.props.isDone,
    dialogVisible: false
  }
  onBoxPress() {
    LayoutAnimation.configureNext({
      duration: 100,
      update: {
        type: LayoutAnimation.Types.easeIn,
        property: LayoutAnimation.Properties.opacity
      }
    })
    const { taskId, task, isDone } = this.props
    this.props.updateTask(taskId, task, isDone)
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
    return (
      <TouchableOpacity
        onPress={() => this.setState({ dialogVisible: true })}
        style={styles.container}
        activeOpacity={0.8}
      >
        <View style={styles.firstContainer}>
          <CheckBox
            containerStyle={styles.CheckBoxContainer}
            checked={this.props.isDone}
            onPress={this.onBoxPress.bind(this)}
            size={22}
            uncheckedColor='#ff006a'
          />
          <Text style={styles.taskTitle}>
            {this.props.task}
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
        <Dialog
          useNativeDriver={true}
          rounded={true}
          dialogStyle={styles.dialogStyle}
          visible={this.state.dialogVisible}
          dialogAnimation={new SlideAnimation({
            initialValue: 0,
            slideFrom: 'bottom',
            useNativeDriver: true,
          })}
          footer={
            <DialogFooter bordered={false}>
              <DialogButton
                activeOpacity={0.95}

                style={{ height: 25 }}
                textStyle={{ color: '#008ee0', fontSize: 18, fontWeight: 'bold' }}
                text="CANCEL"
                onPress={() => {
                  Keyboard.dismiss()
                  this.setState({ dialogVisible: false })
                }}
              />
              <DialogButton
                style={{ marginTop: 0, marginBottom: 0 }}
                textStyle={{ color: '#008ee0', fontSize: 18, fontWeight: 'bold' }}
                text="SAVE"
                onPress={() => {
                  Keyboard.dismiss()
                  this.props.updateTask(this.props.taskId, this.state.task, !this.props.isDone)
                  this.setState({ dialogVisible: false });
                }}
              />
            </DialogFooter>
          }
          onTouchOutside={() => {
            Keyboard.dismiss()
            this.setState({ dialogVisible: false });
          }}
        >
          <DialogContent
            style={{
              flex: 1,
              paddingTop: 10,
              paddingBottom: 10,
              paddingRight: 10,
              paddingLeft: 10
            }}
          >
            <View style={{ flex: 1 }}>
              <TextInput
                multiline
                autoFocus
                value={this.state.task}
                onChangeText={task => this.setState({ task })}
                style={{
                  paddingLeft: 8,
                  alignSelf: 'stretch',
                  flex: 1,
                  textAlignVertical: 'top',
                  fontSize: 16.6,
                  color: '#f5f5f5',
                  backgroundColor: '#111111',
                  borderRadius: 7
                }}
              />
            </View>
          </DialogContent>
        </Dialog>
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
  updateTask: (taskId, task, isDone) => dispatch(updateTask(taskId, task, isDone))
})

export default connect(null, mapDispatchToProps)(ToDoItem) 