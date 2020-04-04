import React from 'react'
import { Navigation } from 'react-native-navigation';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import reducers from '../reducers'
import {
  FirstScreen,
  AuthScreen,
  ToDoListScreen,
  ToDoAddScreen,
  ToDoDetailsScreen,
  EmployeesListScreen,
  EmployeeDetailsScreen,
  EmployeeAddScreen,
  MyMoneyScreen,
  MoneyDetailsScreen,
  MoneyAddScreen,
  MoneyEditScreen,
  MyProfileScreen,
  ForgetPasswordScreen
} from '../screens'

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk))

function ReduxProvider(Component) {
  return (props) => (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  )
}

export default registerScreens = () => {
  Navigation.registerComponent('first', () => ReduxProvider(FirstScreen), () => FirstScreen)
  Navigation.registerComponent('auth', () => ReduxProvider(AuthScreen), () => AuthScreen)
  Navigation.registerComponent('forgetPassword', () => ReduxProvider(ForgetPasswordScreen), () => ForgetPasswordScreen)
  Navigation.registerComponent('todo', () => ReduxProvider(ToDoListScreen), () => ToDoListScreen)
  Navigation.registerComponent('todoAdd', () => ReduxProvider(ToDoAddScreen), () => ToDoAddScreen)
  Navigation.registerComponent('todoDetails', () => ReduxProvider(ToDoDetailsScreen), () => ToDoDetailsScreen)
  Navigation.registerComponent('employees', () => ReduxProvider(EmployeesListScreen), () => EmployeesListScreen)
  Navigation.registerComponent('employeeAdd', () => ReduxProvider(EmployeeAddScreen), () => EmployeeAddScreen)
  Navigation.registerComponent('employeeDetails', () => ReduxProvider(EmployeeDetailsScreen), () => EmployeeDetailsScreen)
  Navigation.registerComponent('money', () => ReduxProvider(MyMoneyScreen), () => MyMoneyScreen)
  Navigation.registerComponent('moneyAdd', () => ReduxProvider(MoneyAddScreen), () => MoneyAddScreen)
  Navigation.registerComponent('moneyDetails', () => ReduxProvider(MoneyDetailsScreen), () => MoneyDetailsScreen)
  Navigation.registerComponent('moneyEdit', () => ReduxProvider(MoneyEditScreen), () => MoneyEditScreen)
  Navigation.registerComponent('profile', () => ReduxProvider(MyProfileScreen), () => MyProfileScreen)
}