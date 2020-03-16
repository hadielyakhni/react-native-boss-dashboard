import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/database'
import { Navigation } from 'react-native-navigation'
import { goToMain } from '../navigation/navigation'
import { Keyboard } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

let UID

// Auth Actions
export const userSignin = (email, password) =>
  dispatch => {
    dispatch({
      type: 'auth_attempt_started'
    })
    firebase.auth().signInWithEmailAndPassword(email.trim(), password)
      .then(async user => {
        await AsyncStorage.setItem('uid', user.user.uid)
        goToMain()
        setTimeout(() => {
          dispatch({
            type: 'user_signedin',
            payload: user
          })
        }, 100);
      })
      .catch(err => dispatch({
        type: 'auth_error',
        payload: err.toString()
      }))
  }
export const userSignup = (email, password) =>
  dispatch => {
    dispatch({
      type: 'auth_attempt_started'
    })
    firebase.auth().createUserWithEmailAndPassword(email.trim(), password)
      .then(async user => {
        await AsyncStorage.setItem('uid', user.user.uid)
        goToMain()
        setTimeout(() => {
          dispatch({
            type: 'user_signedup',
            payload: user
          })
        }, 100);
      })
      .catch(err => dispatch({
        type: 'auth_error',
        payload: err.toString()
      }))
  }

// ToDo Actions
export const fetchTasks = () => {
  return async (dispatch) => {
    dispatch({
      type: 'fetching_tasks'
    })
    var d = new Date()
    UID = await AsyncStorage.getItem('uid')
    firebase.database().ref(`users/${UID}/tasks`)
      .on('value', snapshot => {
        dispatch({
          type: 'tasks_fetch_success',
          payload: snapshot.val()
        })
      })
  }
}
export const addTask = task => {
  Keyboard.dismiss()
  return dispatch => {
    dispatch({
      type: 'add_pressed'
    })
    firebase.database().ref(`users/${UID}/tasks`)
      .push({ task, isDone: false })
  }
}
export const deleteTask = taskId => {
  return () => {
    firebase.database().ref(`users/${UID}/tasks/${taskId}`).remove()
  }
}
export const updateTask = (taskId, task, isDone) => {
  if (isDone)
    firebase.database().ref(`users/${UID}/tasks/${taskId}`)
      .set({ task, isDone: false })
  else
    firebase.database().ref(`users/${UID}/tasks/${taskId}`)
      .set({ task, isDone: true })
  return () => {
    null
  }
}

// Employees Actions
export const addEmployee = (componentId, { name, role, salary, phone, email }) => {
  return dispatch => {
    dispatch({
      type: 'employee_adding_started'
    })
    firebase.database().ref(`/users/${UID}/employees`)
      .push({ name, role, salary, phone, email })
    setTimeout(() => {
      dispatch({
        type: 'employee_adding_finished'
      })
      Navigation.pop(componentId)
    }, 400)
  }
}

export const fetchEmployees = () => {
  return async dispatch => {
    dispatch({
      type: 'fetching_employees'
    })
    UID = await AsyncStorage.getItem('uid')
    firebase.database().ref(`/users/${UID}/employees`)
      .on('value', snapshot => {
        dispatch({
          type: 'employees_fetch_success',
          payload: snapshot.val()
        })
      })
  }
}
export const updateEmployeeInfo = (componentId, { name, role, salary, phone, email, uid }) => {
  return dispatch => {
    dispatch({
      type: 'employee_updating_started'
    })
    firebase.database().ref(`users/${UID}/employees/${uid}`)
      .set({ name, role, salary, phone, email })
    setTimeout(() => {
      dispatch({
        type: 'employee_updating_finished'
      })
      Navigation.pop(componentId)
    }, 400);

  }
}

export const deleteEmployee = (componentId, { uid }) => {
  return dispatch => {
    dispatch({
      type: 'employee_deleting_started'
    })
    firebase.database().ref(`users/${UID}/employees/${uid}`).remove()
    setTimeout(() => {
      dispatch({
        type: 'employee_deleting_finished'
      })
      Navigation.pop(componentId)
    }, 400);
  }
}

// Money Actions
export const fetchAccounts = () => {
  return async dispatch => {
    dispatch({
      type: 'fetching_accounts'
    })
    UID = await AsyncStorage.getItem('uid')
    firebase.database().ref(`/users/${UID}/money`)
      .on('value', snapshot => {
        dispatch({
          type: 'accounts_fetch_success',
          payload: snapshot.val()
        })
      })
  }
}
export const addMoneyAccount = (componentId, { name, status, amount, amount1, amount2, amount3 }) => {
  return dispatch => {
    dispatch({
      type: 'account_adding_started'
    })
    firebase.database().ref(`/users/${UID}/money`)
      .push({ name, status, amount, amount1, amount2, amount3 })
    setTimeout(() => {
      dispatch({
        type: 'account_reset'
      })
      dispatch({
        type: 'account_adding_finished'
      })
      Navigation.pop(componentId)
    }, 400);
  }
}
export const updateAccountInfo = (componentId, { name, status, amount, amount1, amount2, amount3, uid }) => {
  return dispatch => {
    dispatch({
      type: 'account_updating_started'
    })
    firebase.database().ref(`users/${UID}/money/${uid}`)
      .set({ name, status, amount, amount1, amount2, amount3 })
    setTimeout(() => {
      dispatch({
        type: 'account_reset'
      })
      dispatch({
        type: 'account_updating_finished'
      })
      Navigation.pop(componentId)
    }, 400);
  }
}
export const deleteAccount = (componentId, { uid }) => {
  return dispatch => {
    dispatch({
      type: 'account_deleting_started'
    })
    firebase.database().ref(`users/${UID}/money/${uid}`).remove()
    setTimeout(() => {
      dispatch({
        type: 'account_deleting_finished'
      })
      Navigation.pop(componentId)
    }, 400);
  }
}