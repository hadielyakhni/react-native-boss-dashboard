import firebase from 'firebase'
import { navigate, navigateBack } from '../navigationRef'
import { AsyncStorage, Keyboard } from 'react-native'

let UID

// Auth Actions
export const resetAuth = () => ({
  type: 'auth_reset'
})
export const emailChanged = email => ({
  type: 'email_changed',
  payload: email
})
export const passwordChanged = password => ({
  type: 'password_changed',
  payload: password
})
export const userSignin = (email, password) =>
  dispatch => {
    dispatch({
      type: 'auth_attempt_started'
    })
    firebase.auth().signInWithEmailAndPassword(email.trim(), password)
      .then(async user => {
        await AsyncStorage.setItem('uid', user.user.uid)
        dispatch({
          type: 'user_signedin',
          payload: user
        })
        navigate('Main')
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
        dispatch({
          type: 'user_signedup',
          payload: user
        })
        navigate('Main')
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
export const changeTask = task => ({
  type: 'task_changed',
  payload: task
})
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
export const updateOnScreenEmployeeInfo = ({ prop, value }) => ({
  type: 'employee_updated',
  payload: { prop, value }
})
export const addEmployee = ({ name, role, salary, phone, email }) => {
  return dispatch => {
    dispatch({
      type: 'employee_adding_started'
    })
    firebase.database().ref(`/users/${UID}/employees`)
      .push({ name, role, salary, phone, email })
      .then(() => {
        dispatch({
          type: 'employee_adding_finished'
        })
        navigateBack()
      })
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
export const resetEmployee = () => ({
  type: 'employee_reset'
})
export const updateEmployeeInfo = ({ name, role, salary, phone, email, uid }) => {
  return dispatch => {
    dispatch({
      type: 'employee_updating_started'
    })
    firebase.database().ref(`users/${UID}/employees/${uid}`)
      .set({ name, role, salary, phone, email })
      .then(() => {
        dispatch({
          type: 'employee_reset'
        })
        dispatch({
          type: 'employee_updating_finished'
        })
        navigate('EmployeesList')
      })
  }
}
export const deleteEmployee = ({ uid }) => {
  return dispatch => {
    dispatch({
      type: 'employee_deleting_started'
    })
    firebase.database().ref(`users/${UID}/employees/${uid}`)
      .remove()
      .then(() => {
        dispatch({
          type: 'employee_deleting_finished'
        })
        navigate('EmployeesList')
      })
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
export const resetAccount = () => ({
  type: 'account_reset'
})
export const updateOnScreenAccountInfo = ({ prop, value }) => ({
  type: 'account_updated',
  payload: { prop, value }
})
export const addMoneyAccount = ({ name, status, amount, amount1, amount2, amount3 }) => {
  return dispatch => {
    dispatch({
      type: 'account_adding_started'
    })
    firebase.database().ref(`/users/${UID}/money`)
      .push({ name, status, amount, amount1, amount2, amount3 })
      .then(() => {
        dispatch({
          type: 'account_reset'
        })
        dispatch({
          type: 'account_adding_finished'
        })
        navigateBack()
      })
  }
}
export const updateAccountInfo = ({ name, status, amount, amount1, amount2, amount3, uid }) => {
  return dispatch => {
    dispatch({
      type: 'account_updating_started'
    })
    firebase.database().ref(`users/${UID}/money/${uid}`)
      .set({ name, status, amount, amount1, amount2, amount3 })
      .then(() => {
        dispatch({
          type: 'account_reset'
        })
        dispatch({
          type: 'account_updating_finished'
        })
        navigate('MyMoney')
      })
  }
}
export const deleteAccount = ({ uid }) => {
  return dispatch => {
    dispatch({
      type: 'account_deleting_started'
    })
    firebase.database().ref(`users/${UID}/money/${uid}`)
      .remove()
      .then(() => {
        dispatch({
          type: 'account_deleting_finished'
        })
        navigate('MyMoney')
      })
  }
}