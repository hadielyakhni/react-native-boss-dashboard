import React, { Component } from 'react'
import { StatusBar, View } from 'react-native'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/RootNavigation';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import firebase from 'firebase'
import ReduxThunk from 'redux-thunk'
import { Icon } from 'native-base'
import reducers from './src/reducers'
import firebaseConfig from './src/firebaseConfig'
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
} from './src/screens'


const Stack = createStackNavigator()
const MainTab = createMaterialTopTabNavigator()
const AuthStack = createStackNavigator()
const ToDoStack = createStackNavigator()
const EmployeesStack = createStackNavigator()
const AccountsStack = createStackNavigator()

export default class App extends Component {
  UNSAFE_componentWillMount() {
    if (!firebase.apps.length)
      firebase.initializeApp(firebaseConfig);
  }
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
        <View style={{ flex: 1 }}>
          <StatusBar backgroundColor='#000' />
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator headerMode="none" initialRouteName="First">
              <Stack.Screen name="First" component={FirstScreen} />
              <Stack.Screen name="Auth" component={AuthScreens} />
              <Stack.Screen name="Main" component={MainScreens} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </Provider>
    )
  }
}

function AuthScreens() {
  return (
    <AuthStack.Navigator headerMode="none" initialRouteName="Login">
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  )
}

function MainScreens() {
  return (
    <MainTab.Navigator tabBarPosition="bottom" initialRouteName="ToDo" >
      <MainTab.Screen name="ToDo" component={ToDoScreen} />
      <MainTab.Screen name="Employees" component={EmployeesScreens} />
      <MainTab.Screen name="Money" component={AccountsScreens} />
      <MainTab.Screen name="Profile" component={MyProfileScreen} />
    </MainTab.Navigator >
  );
}

function ToDoScreen() {
  return (
    <ToDoStack.Navigator
      screenOptions={{
        headerTitle: "My Tasks",
        headerStyle: { backgroundColor: '#000' },
        headerTitleStyle: { color: '#fff', fontWeight: 'bold' }
      }}
    >
      <AuthStack.Screen name="ToDo" component={ToDoListScreen} />
    </ToDoStack.Navigator>
  )
}

function EmployeesScreens() {
  return (
    <EmployeesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTitleStyle: { color: '#fff', fontWeight: 'bold' },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 200 } },
          close: { animation: 'timing', config: { duration: 200 } }
        }
      }}
      headerMode="float"
      initialRouteName="EmployeesList"
    >
      <EmployeesStack.Screen options={{ headerTitle: 'My Employees' }} name="EmployeesList" component={EmployeesListScreen} />
      <EmployeesStack.Screen name="EmployeeAdd" component={EmployeeAddScreen} />
      <EmployeesStack.Screen name="EmployeeDetails" component={EmployeeDetailsScreen} />
    </EmployeesStack.Navigator>
  )
}

function AccountsScreens() {
  return (
    <AccountsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTitleStyle: { color: '#fff', fontWeight: 'bold' },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 200 } },
          close: { animation: 'timing', config: { duration: 200 } }
        }
      }}
      headerMode="float"
      initialRouteName="MoneyList"
    >
      <AccountsStack.Screen options={{ headerTitle: 'My Money' }} name="MoneyList" component={MyMoneyScreen} />
      <AccountsStack.Screen name="MoneyAdd" component={MoneyAddScreen} />
      <AccountsStack.Screen name="MoneyDetails" component={MoneyDetailsScreen} />
    </AccountsStack.Navigator>
  )
}