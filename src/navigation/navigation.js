import { Navigation } from 'react-native-navigation'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { Dimensions } from 'react-native'

export const goToAuth = () => Navigation.setRoot({
  root: {
    stack: {
      children: [
        {
          component: {
            name: 'auth'
          }
        }
      ],
      options: {
        topBar: {
          visible: false
        },
        animations: {
          setRoot: {
            waitForRender: true,
            translationY: {
              from: -Dimensions.get('window').height,
              to: 0,
              duration: 0
            }
          },
          push: {
            waitForRender: true,
            content: {
              translationY: {
                from: Dimensions.get('window').height,
                to: 0,
                duration: 200
              }
            }
          }
        }
      }
    }
  }
})

export const goToMain = () => Promise.all([
  FontAwesome5.getImageSource('tasks', 25),
  FontAwesome5.getImageSource('user-tie', 25),
  Fontisto.getImageSource('wallet', 25),
  Fontisto.getImageSource('player-settings', 25)
]).then(([tasksIcon, workIcon, moneyIcon, personIcon]) => Navigation.setRoot({
  root: {
    bottomTabs: {
      children: [
        {
          stack: {
            children: [
              {
                component: {
                  name: 'todo'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: tasksIcon,
                iconColor: '#c8d2da',
                selectedIconColor: '#008ee0',
                text: 'Tasks',
                fontFamily: 'SourceSansPro-Regular',
                selectedFontSize: 13.5,
                fontSize: 11,
                selectedTextColor: '#008ee0'
              },
              topBar: {
                visible: false
              }
            }
          }
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'employees'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: workIcon,
                iconColor: '#c8d2da',
                selectedIconColor: '#008ee0',
                text: 'Employees',
                fontFamily: 'SourceSansPro-Regular',
                selectedFontSize: 13.5,
                fontSize: 11,
                selectedTextColor: '#008ee0'
              },
              topBar: {
                visible: false
              }
            }
          }
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'money'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: moneyIcon,
                iconColor: '#c8d2da',
                selectedIconColor: '#008ee0',
                text: 'Wallet',
                fontFamily: 'SourceSansPro-Regular',
                selectedFontSize: 13.5,
                fontSize: 11,
                selectedTextColor: '#008ee0'
              },
              topBar: {
                visible: false
              }
            }
          }
        },
        {
          stack: {
            children: [
              {
                component: {
                  name: 'profile'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: personIcon,
                iconColor: '#c8d2da',
                selectedIconColor: '#008ee0',
                text: 'Settings',
                fontFamily: 'SourceSansPro-Regular',
                selectedFontSize: 13.5,
                fontSize: 11,
                selectedTextColor: '#008ee0'
              },
              topBar: {
                visible: false
              }
            }
          }
        }
      ],
      options: {
        animations: {
          setRoot: {
            waitForRender: true
          }
        },
        bottomTabs: {
          backgroundColor: '#000',
          preferLargeIcons: true,
          titleDisplayMode: 'alwaysShow'
        }
      },
    }
  }
}))
