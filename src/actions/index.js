import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/database'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import { GoogleSignin } from '@react-native-community/google-signin'
import { Navigation } from 'react-native-navigation'
import { goToMain } from '../navigation/navigation'
import { Keyboard } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

let UID, TASKS_SORT_BY, TASKS_SORT_ORDER, EMPLOYEES_SORT_BY, EMPLOYEES_SORT_ORDER, ACCOUNTS_SORT_BY, ACCOUNTS_SORT_ORDER, LAST_DELETED_TASK, LAST_TASK_DELETE_DATE

// Auth Actions
export const userSignin = (email, password) =>
  dispatch => {
    dispatch({ type: 'auth_attempt_started' })
    firebase.auth().signInWithEmailAndPassword(email.trim(), password)
      .then(async user => {
        await AsyncStorage.setItem('uid', user.user.uid)
        if (!TASKS_SORT_BY && !TASKS_SORT_ORDER)
          dispatch(getTasksSortData(user.user.uid))
        if (!EMPLOYEES_SORT_BY && !EMPLOYEES_SORT_ORDER)
          dispatch(getEmployeesSortData(user.user.uid))
        if (!ACCOUNTS_SORT_BY && !ACCOUNTS_SORT_ORDER)
          dispatch(getAccountsSortData(user.user.uid))
        goToMain()
        setTimeout(() => {
          dispatch({
            type: 'user_signedin',
            payload: user
          })
        }, 100);
      })
      .catch(err => {
        dispatch({
          type: 'auth_error',
          payload: err.toString()
        })
      })
  }

export const userSignup = (email, password) =>
  dispatch => {
    dispatch({ type: 'auth_attempt_started' })
    firebase.auth().createUserWithEmailAndPassword(email.trim(), password)
      .then(async user => {
        let uid = user.user.uid
        await Promise.all([
          AsyncStorage.setItem('uid', uid),
          firebase.database().ref(`users/${uid}/tasks/sortData`).set({ sortBy: 'time', sortOrder: 'asc' }),
          firebase.database().ref(`users/${uid}/employees/sortData`).set({ sortBy: 'default', sortOrder: 'asc' }),
          firebase.database().ref(`users/${uid}/money/sortData`).set({ sortBy: 'default', sortOrder: 'asc' })
        ])
        dispatch(getTasksSortData(uid))
        dispatch(getEmployeesSortData(uid))
        dispatch(getAccountsSortData(uid))
        goToMain()
        setTimeout(() => {
          dispatch({
            type: 'user_signedup',
            payload: user
          })
        }, 100);
      })
      .catch(err => {
        dispatch({
          type: 'auth_error',
          payload: err.toString()
        })
      })
  }

export const userAuthenticateWithFacebook = () =>
  async dispatch => {
    try {
      dispatch({ type: 'disable_facebook_button' })
      await LoginManager.logInWithPermissions(['public_profile', 'email']);
      const data = await AccessToken.getCurrentAccessToken();
      if (!data)
        throw new Error('Something went wrong obtaining access token');
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
      const user = await firebase.auth().signInWithCredential(credential);
      if (user.additionalUserInfo.isNewUser) {
        let uid = user.user.uid
        await Promise.all([
          await AsyncStorage.setItem('uid', uid),
          firebase.database().ref(`users/${uid}/tasks/sortData`).set({ sortBy: 'time', sortOrder: 'asc' }),
          firebase.database().ref(`users/${uid}/employees/sortData`).set({ sortBy: 'default', sortOrder: 'asc' }),
          firebase.database().ref(`users/${uid}/money/sortData`).set({ sortBy: 'default', sortOrder: 'asc' })
        ])
        dispatch(getTasksSortData(uid))
        dispatch(getEmployeesSortData(uid))
        dispatch(getAccountsSortData(uid))
      }
      else {
        let uid = user.user.uid
        await AsyncStorage.setItem('uid', uid)
        if (!TASKS_SORT_BY && !TASKS_SORT_ORDER)
          dispatch(getTasksSortData(uid))
        if (!EMPLOYEES_SORT_BY && !EMPLOYEES_SORT_ORDER)
          dispatch(getEmployeesSortData(uid))
        if (!ACCOUNTS_SORT_BY && !ACCOUNTS_SORT_ORDER)
          dispatch(getAccountsSortData(uid))
      }
      goToMain()
      setTimeout(() => {
        dispatch({
          type: 'user_signedin',
          payload: user
        })
      }, 100);
    }
    catch (err) {
      if (err.toString() === 'Error: Something went wrong obtaining access token')
        dispatch({ type: 'user_cancel_facebook_auth' })
      else
        dispatch({
          type: 'facebook_auth_error',
          payload: err.toString()
        })
    }
  }

export const userAuthenticateWithGoogle = () =>
  async dispatch => {
    try {
      dispatch({ type: 'disable_google_button' })
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken)
      const user = await firebase.auth().signInWithCredential(googleCredential)
      if (user.additionalUserInfo.isNewUser) {
        let uid = user.user.uid
        await Promise.all([
          await AsyncStorage.setItem('uid', uid),
          firebase.database().ref(`users/${uid}/tasks/sortData`).set({ sortBy: 'time', sortOrder: 'asc' }),
          firebase.database().ref(`users/${uid}/employees/sortData`).set({ sortBy: 'default', sortOrder: 'asc' }),
          firebase.database().ref(`users/${uid}/money/sortData`).set({ sortBy: 'default', sortOrder: 'asc' })
        ])
        dispatch(getTasksSortData(uid))
        dispatch(getEmployeesSortData(uid))
        dispatch(getAccountsSortData(uid))
      }
      else {
        let uid = user.user.uid
        await AsyncStorage.setItem('uid', uid)
        if (!TASKS_SORT_BY && !TASKS_SORT_ORDER)
          dispatch(getTasksSortData(uid))
        if (!EMPLOYEES_SORT_BY && !EMPLOYEES_SORT_ORDER)
          dispatch(getEmployeesSortData(uid))
        if (!ACCOUNTS_SORT_BY && !ACCOUNTS_SORT_ORDER)
          dispatch(getAccountsSortData(uid))
      }
      goToMain()
      setTimeout(() => {
        dispatch({
          type: 'user_signedin',
          payload: user
        })
      }, 100);
    }
    catch (err) {
      if (err.toString() !== 'Error: Sign in action cancelled')
        dispatch({
          type: 'auth_error',
          payload: err.toString()
        })
      else
        dispatch({ type: 'user_cancel_google_auth' })
    }
  }

export const sendPasswordResetEmail = email =>
  async dispatch => {
    try {
      dispatch({ type: 'send_password_reset_email_start' })
      await firebase.auth().sendPasswordResetEmail(email)
      dispatch({ type: 'password_reset_done' })
    } catch (error) {
      dispatch({
        type: 'auth_error',
        payload: error.toString()
      })
    }
  }

export const dsimissAuthError = () => ({
  type: 'reset_error'
})

export const hidePasswordResetSuccessModal = () => ({
  type: 'hide_password_reset_success_modal'
})

// ToDo Actions
export const getTasksSortData = uid => dispatch => {
  firebase.database().ref(`/users/${uid}/tasks/sortData`)
    .on('value', snapshot => {
      TASKS_SORT_BY = snapshot.val().sortBy
      TASKS_SORT_ORDER = snapshot.val().sortOrder
      dispatch({
        type: 'tasks_sort_data_change',
        payload: snapshot.val()
      })
    })
}

export const fetchTasks = () => {
  return async dispatch => {
    dispatch({ type: 'fetching_tasks' })
    UID = await AsyncStorage.getItem('uid')
    firebase.database().ref(`users/${UID}/tasks/tasks`)
      .on('value', snapshot => {
        dispatch({
          type: 'tasks_fetch_success',
          payload: snapshot.val()
        })
      })
  }
}

export const addTask = (task, description, fromWichScreen, componentId) => {
  Keyboard.dismiss()
  if (!description)
    description = ''
  return dispatch => {
    dispatch({ type: 'add_pressed' })
    firebase.database().ref(`users/${UID}/tasks/tasks`)
      .push({ task: task.trim(), description: description.trim(), isDone: false, date: Date.now(), customDate: Date.now() })
    if (fromWichScreen === 'todoAdd')
      Navigation.pop(componentId)
  }
}

export const updateTask = (taskId, task, description, isDone, componentId) => {
  return () => {
    if (componentId) {
      firebase.database().ref(`users/${UID}/tasks/tasks/${taskId}`)
        .update({ task, description, isDone })
      Navigation.pop(componentId)
    }
    else
      firebase.database().ref(`users/${UID}/tasks/tasks/${taskId}`)
        .update({ isDone: !isDone, date: Date.now() })
  }
}

export const deleteTask = (taskId, fromWichScreen, componentId, taskData) => {
  LAST_DELETED_TASK = taskData
  return dispatch => {
    firebase.database().ref(`users/${UID}/tasks/tasks/${taskId}`).remove()
    LAST_TASK_DELETE_DATE = Date.now()
    if (fromWichScreen === 'todoDetails')
      Navigation.pop(componentId)
    dispatch({ type: 'show_undo_task_message' })
    setTimeout(() => {
      if (Date.now() - LAST_TASK_DELETE_DATE >= 2000)
        dispatch({ type: 'hide_undo_task_message' })
    }, 2000);
  }
}

export const restoreLastDeletedTask = () => {
  firebase.database().ref(`users/${UID}/tasks/tasks/`).push(LAST_DELETED_TASK)
  return dispatch => {
    dispatch({ type: 'hide_undo_task_message' })
  }
}

export const changeTasksSortData = (sortBy, sortOrder) => {
  return () => {
    firebase.database().ref(`users/${UID}/tasks/sortData`).update({ sortBy, sortOrder })
  }
}

// Employees Actions
export const getEmployeesSortData = uid => dispatch => {
  firebase.database().ref(`/users/${uid}/employees/sortData`)
    .on('value', snapshot => {
      EMPLOYEES_SORT_BY = snapshot.val().sortBy
      EMPLOYEES_SORT_ORDER = snapshot.val().sortOrder
      dispatch({
        type: 'employees_sort_data_change',
        payload: snapshot.val()
      })
    })
}

export const addEmployee = (componentId, { name, role, salary, phone, email, joinDate }) => {
  return dispatch => {
    firebase.database().ref(`/users/${UID}/employees/employees`)
      .push({ name, role, salary, phone, email, joinDate })
    Navigation.pop(componentId)
  }
}

export const fetchEmployees = () => {
  return async dispatch => {
    dispatch({ type: 'fetching_employees' })
    UID = await AsyncStorage.getItem('uid')
    firebase.database().ref(`/users/${UID}/employees/employees`)
      .on('value', snapshot => {
        dispatch({
          type: 'employees_fetch_success',
          payload: snapshot.val()
        })
      })
  }
}

export const updateEmployeeInfo = (componentId, { name, role, salary, phone, email, joinDate, uid }) => {
  return () => {
    firebase.database().ref(`users/${UID}/employees/employees/${uid}`)
      .set({ name, role, salary, phone, email, joinDate })
    Navigation.pop(componentId)
  }
}

export const deleteEmployee = (componentId, { uid }) => {
  return () => {
    firebase.database().ref(`users/${UID}/employees/employees/${uid}`).remove()
    Navigation.pop(componentId)
  }
}

export const changeEmployeesSortData = (sortBy, sortOrder) => {
  return () => {
    firebase.database().ref(`users/${UID}/employees/sortData`).update({ sortBy, sortOrder })
  }
}

// Money Actions
export const getAccountsSortData = uid => dispatch => {
  firebase.database().ref(`/users/${uid}/money/sortData`)
    .on('value', snapshot => {
      ACCOUNTS_SORT_BY = snapshot.val().sortBy
      ACCOUNTS_SORT_ORDER = snapshot.val().sortOrder
      dispatch({
        type: 'accounts_sort_data_change',
        payload: snapshot.val()
      })
    })
}

export const fetchAccounts = () => {
  return async dispatch => {
    dispatch({ type: 'fetching_accounts' })
    UID = await AsyncStorage.getItem('uid')
    firebase.database().ref(`/users/${UID}/money/accounts`)
      .on('value', snapshot => {
        dispatch({
          type: 'accounts_fetch_success',
          payload: snapshot.val()
        })
      })
  }
}

export const addMoneyAccount = (componentId, { name, phone = '', status, amount }) => {
  if (status === 'HIM')
    amount *= -1
  name = name.trim()
  return () => {
    const addedAccountId = firebase.database().ref(`/users/${UID}/money/accounts`)
      .push({ name, phone, amount, lastTransaction: Date.now() }).key
    firebase.database().ref(`/users/${UID}/money/accounts/${addedAccountId}/transactions`)
      .push({
        transAmount: Math.abs(amount),
        status: amount < 0 ? 'Received' : 'Sent',
        date: Date.now()
      })
    Navigation.pop(componentId)
  }
}

export const addTransaction = (oldAmount, transAmount, status, accountId) => {
  let amount
  if (status === 'Sent')
    amount = oldAmount + transAmount
  else if (status === 'Received')
    amount = oldAmount - transAmount
  return () => {
    firebase.database().ref(`users/${UID}/money/accounts/${accountId}`)
      .update({ amount, lastTransaction: Date.now() })
    firebase.database().ref(`users/${UID}/money/accounts/${accountId}/transactions`)
      .push({
        transAmount,
        status: status === 'Sent' ? 'Sent' : 'Received',
        date: Date.now()
      })
  }
}

export const editAccountInfo = (accountId, name, phone, componentId) =>
  () => {
    firebase.database().ref(`users/${UID}/money/accounts/${accountId}`).update({ name, phone })
    Navigation.pop(componentId)
  }

export const deleteAccount = (componentId, accountId) =>
  () => {
    firebase.database().ref(`users/${UID}/money/accounts/${accountId}`).remove()
    Navigation.pop(componentId)
  }

export const changeAccountsSortData = (sortBy, sortOrder) =>
  () => {
    firebase.database().ref(`users/${UID}/money/sortData`).update({ sortBy, sortOrder })
  }