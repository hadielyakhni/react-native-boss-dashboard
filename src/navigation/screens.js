import React from 'react'
import { Navigation } from 'react-native-navigation';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import reducers from '../reducers'
import {
  FirstScreen,
  LoginScreen,
  SignupScreen,
  ToDoListScreen,
  EmployeesListScreen,
  EmployeeDetailsScreen,
  EmployeeAddScreen,
  MyMoneyScreen,
  MoneyDetailsScreen,
  MoneyAddScreen,
  MyProfileScreen,
  MyInfoScreen,
  EditNameScreen,
  ChangePasswordScreen
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
  Navigation.registerComponent('first', () => FirstScreen)
  Navigation.registerComponent('login', () => ReduxProvider(LoginScreen), () => LoginScreen)
  Navigation.registerComponent('signup', () => ReduxProvider(SignupScreen), () => SignupScreen)
  Navigation.registerComponent('todo', () => ReduxProvider(ToDoListScreen), () => ToDoListScreen)
  Navigation.registerComponent('employees', () => ReduxProvider(EmployeesListScreen), () => EmployeesListScreen)
  Navigation.registerComponent('employeeAdd', () => ReduxProvider(EmployeeAddScreen), () => EmployeeAddScreen)
  Navigation.registerComponent('employeeDetails', () => ReduxProvider(EmployeeDetailsScreen), () => EmployeeDetailsScreen)
  Navigation.registerComponent('money', () => ReduxProvider(MyMoneyScreen), () => MyMoneyScreen)
  Navigation.registerComponent('moneyAdd', () => ReduxProvider(MoneyAddScreen), () => MoneyAddScreen)
  Navigation.registerComponent('moneyDetails', () => ReduxProvider(MoneyDetailsScreen), () => MoneyDetailsScreen)
  Navigation.registerComponent('profile', () => ReduxProvider(MyProfileScreen), () => MyProfileScreen)
}