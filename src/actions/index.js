import firebase from '@react-native-firebase/app'
import '@react-native-firebase/auth'
import '@react-native-firebase/database'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import { Navigation } from 'react-native-navigation'
import { goToMain } from '../navigation/navigation'
import { Keyboard, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

let UID
// Auth Actions
export const userSignin = (email, password) =>
  dispatch => {
    dispatch({ type: 'auth_attempt_started' })
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
        await AsyncStorage.setItem('uid', user.user.uid)
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
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled)
        throw new Error('User cancelled the login process');
      const data = await AccessToken.getCurrentAccessToken();
      if (!data)
        throw new Error('Something went wrong obtaining access token');
      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
      const user = await firebase.auth().signInWithCredential(credential);
      await AsyncStorage.setItem('uid', user.user.uid)
      goToMain()
      setTimeout(() => {
        dispatch({
          type: 'user_signedin',
          payload: user
        })
      }, 100);
    }
    catch (err) {
      dispatch({ type: 'facebook_auth_error', payload: err.toString() })
    }
  }

export const sendPasswordResetEmail = email =>
  async dispatch => {
    console.log(email)
    try {
      await firebase.auth().sendPasswordResetEmail(email)
      dispatch({
        type: 'password_reset_done'
      })
    } catch (error) {
      console.log(error)
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
export const fetchTasks = () => {
  return async (dispatch) => {
    dispatch({ type: 'fetching_tasks' })
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
export const addTask = (task, description, fromWichScreen, componentId) => {
  Keyboard.dismiss()
  if (!description)
    description = ''
  return dispatch => {
    dispatch({ type: 'add_pressed' })
    firebase.database().ref(`users/${UID}/tasks`)
      .push({ task, description, isDone: false, date: Date.now() })
    if (fromWichScreen === 'todoAdd')
      Navigation.pop(componentId)
  }
}

export const updateTask = (taskId, task, description, isDone, componentId) => {
  if (componentId) {
    firebase.database().ref(`users/${UID}/tasks/${taskId}`)
      .update({ task, description, isDone })
    Navigation.pop(componentId)
  }
  else
    firebase.database().ref(`users/${UID}/tasks/${taskId}`)
      .set({ task, description, isDone: !isDone, date: Date.now() })
  return () => {
    null
  }
}

export const deleteTask = (taskId, fromWichScreen, componentId) => {
  return dispatch => {
    dispatch({ type: 'deleting_task_started' })
    firebase.database().ref(`users/${UID}/tasks/${taskId}`).remove()
    dispatch({ type: 'deleting_task_finished' })
    if (fromWichScreen === 'todoDetails')
      Navigation.pop(componentId)
  }
}

// Employees Actions
export const addEmployee = (componentId, { name, role, salary, phone, email }) => {
  return dispatch => {
    firebase.database().ref(`/users/${UID}/employees`)
      .push({ name, role, salary, phone, email })
    Navigation.pop(componentId)
  }
}

export const fetchEmployees = () => {
  return async dispatch => {
    dispatch({ type: 'fetching_employees' })
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
  return () => {
    firebase.database().ref(`users/${UID}/employees/${uid}`)
      .set({ name, role, salary, phone, email })
    Navigation.pop(componentId)
  }
}

export const deleteEmployee = (componentId, { uid }) => {
  return () => {
    firebase.database().ref(`users/${UID}/employees/${uid}`).remove()
    Navigation.pop(componentId)
  }
}

// Money Actions
export const fetchAccounts = () => {
  return async dispatch => {
    dispatch({ type: 'fetching_accounts' })
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

export const addMoneyAccount = (initialStackId, componentId, { name, phone = '', status, amount }) => {
  if (status === 'HIM')
    amount *= -1
  return () => {
    const addedAccountId = firebase.database().ref(`/users/${UID}/money`)
      .push({ name: name.trim(), phone, amount }).key
    firebase.database().ref(`/users/${UID}/money/${addedAccountId}/transactions`)
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
    firebase.database().ref(`users/${UID}/money/${accountId}`)
      .update({ amount })
    firebase.database().ref(`users/${UID}/money/${accountId}/transactions`)
      .push({
        transAmount,
        status: status === 'Sent' ? 'Sent' : 'Received',
        date: Date.now()
      })
  }
}

export const editAccountInfo = (accountId, name, phone, componentId) =>
  () => {
    firebase.database().ref(`users/${UID}/money/${accountId}`).update({ name, phone })
    Navigation.pop(componentId)
  }

export const deleteAccount = (componentId, accountId) => {
  return () => {
    firebase.database().ref(`users/${UID}/money/${accountId}`).remove()
    Navigation.pop(componentId)
  }
}