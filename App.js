import React, { Component } from 'react'
import { StatusBar, View } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import firebase from 'firebase'
import ReduxThunk from 'redux-thunk'
import { Icon } from 'native-base'
import reducers from './src/reducers'
import firebaseConfig from './src/firebaseConfig'
import { setNavigator } from './src/navigationRef'
import { transitionConfig } from './src/animations/stackNavAnimation'
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

export default class App extends Component {
    UNSAFE_componentWillMount() {
        console.log('will mount')
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('firebase initialized')
        }
    }
    render() {
        return (
            <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
                <View style={{ flex: 1 }}>
                    <StatusBar backgroundColor='#000' />
                    <AppContainer ref={navigator => setNavigator(navigator)} />
                </View>
            </Provider>
        )
    }
}

const AppContainer = createAppContainer(
    createSwitchNavigator({
        First: FirstScreen,
        Auth: createStackNavigator({
            Login: LoginScreen,
            Signup: SignupScreen
        }, {
            headerMode: 'none'
        }),
        Main: createMaterialTopTabNavigator({
            ToDo: {
                screen: createStackNavigator({
                    ToDoList: ToDoListScreen
                }, {
                    defaultNavigationOptions: {
                        headerStyle: {
                            backgroundColor: '#000',
                            height: 70
                        },
                        headerTitle: 'MY TASKS',
                        headerTitleStyle: {
                            color: '#f5f5f5',
                            fontWeight: 'bold',
                            fontSize: 22
                        }
                    }
                }),
                navigationOptions: {
                    tabBarIcon: ({ tintColor, focused }) => (
                        <Icon
                            name={focused ? 'ios-list-box' : 'md-list-box'}
                            style={{
                                fontSize: 30,
                                color: tintColor
                            }}
                        />
                    )
                }
            },
            Employees: {
                screen: createStackNavigator({
                    EmployeesList: EmployeesListScreen,
                    EmployeeDetails: EmployeeDetailsScreen,
                    EmployeeAdd: EmployeeAddScreen
                }, {
                    transitionConfig,
                    defaultNavigationOptions: {
                        headerStyle: {
                            backgroundColor: '#000'
                        },
                        headerTitleStyle: {
                            color: '#f5f5f5',
                            fontWeight: 'bold',
                            fontSize: 22
                        },
                        headerLeftContainerStyle: {
                            width: 50,
                            paddingHorizontal: 0,
                            paddingLeft: 15,
                            justifyContent: 'center'
                        }
                    }
                }),
                navigationOptions: {
                    tabBarIcon: ({ tintColor, focused }) => (
                        <Icon
                            name={focused ? 'ios-briefcase' : 'md-briefcase'}
                            style={{
                                fontSize: 30,
                                color: tintColor
                            }}
                        />
                    )
                },
            },
            Money: {
                screen: createStackNavigator({
                    MyMoney: MyMoneyScreen,
                    MoneyDetails: MoneyDetailsScreen,
                    MoneyAdd: MoneyAddScreen
                }, {
                    transitionConfig,
                    defaultNavigationOptions: {
                        headerStyle: {
                            backgroundColor: '#000'
                        },
                        headerTitleStyle: {
                            color: '#f5f5f5',
                            fontWeight: 'bold',
                            fontSize: 22
                        },
                        headerLeftContainerStyle: {
                            width: 50,
                            paddingHorizontal: 0,
                            paddingLeft: 15,
                            justifyContent: 'center'
                        }
                    }
                }),
                navigationOptions: {
                    tabBarIcon: ({ tintColor, focused }) => (
                        <Icon
                            name={focused ? 'ios-cash' : 'md-cash'}
                            style={{
                                fontSize: 30,
                                color: tintColor
                            }}
                        />
                    )
                }
            },
            Profile: {
                screen: createStackNavigator({
                    MyProfile: MyProfileScreen,
                    MyInfo: MyInfoScreen,
                    EditName: EditNameScreen,
                    ChangePassword: ChangePasswordScreen
                }, {
                    defaultNavigationOptions: {
                        headerStyle: {
                            backgroundColor: '#000'
                        },
                        headerTitleStyle: {
                            color: '#f5f5f5',
                            fontWeight: 'bold',
                            fontSize: 22
                        },
                        headerLeftContainerStyle: {
                            width: 50,
                            paddingHorizontal: 0,
                            paddingLeft: 15,
                            justifyContent: 'center'
                        }
                    }
                }),
                navigationOptions: {
                    tabBarIcon: ({ tintColor, focused }) => (
                        <Icon
                            name={focused ? 'ios-person' : 'md-person'}
                            style={{
                                fontSize: 30,
                                color: tintColor
                            }}
                        />
                    )
                }
            }
        },
            {
                tabBarPosition: 'bottom',
                initialRouteName: 'ToDo',
                tabBarOptions: {
                    style: {
                        backgroundColor: '#000',
                        height: 56
                    },
                    activeTintColor: '#008ee0',
                    inactiveTintColor: '#464953',
                    showLabel: false,
                    showIcon: true,
                    indicatorStyle: {
                        backgroundColor: '#008ee0'
                    }
                }
            })
    }, {
        initialRouteName: 'First'
    })
)