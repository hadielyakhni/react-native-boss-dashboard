import { Navigation } from 'react-native-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
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
  FontAwesome.getImageSource('tasks', 25),
  FontAwesome.getImageSource('briefcase', 25),
  FontAwesome.getImageSource('money', 25),
  FontAwesome.getImageSource('user-circle', 25)
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
                selectedFontSize: 12,
                selectedTextColor: '#008ee0'
              },
              topBar: {
                background: {
                  color: '#000'
                },
                title: {
                  fontSize: 21,
                  text: 'My Tasks',
                  color: '#fff'
                }
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
                selectedFontSize: 12,
                selectedTextColor: '#008ee0'
              },
              topBar: {
                background: {
                  color: '#000'
                },
                title: {
                  fontSize: 21,
                  text: 'My Employees',
                  color: '#fff'
                },
                backButton: {
                  color: '#fff'
                }
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
                selectedFontSize: 12,
                selectedTextColor: '#008ee0'
              },
              topBar: {
                background: {
                  color: '#000'
                },
                title: {
                  fontSize: 21,
                  text: 'My Wallet',
                  color: '#fff'
                },
                backButton: {
                  color: '#fff'
                }
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
                text: 'Profile',
                selectedFontSize: 12,
                selectedTextColor: '#008ee0'
              },
              topBar: {
                background: {
                  color: '#000'
                },
                title: {
                  fontSize: 21,
                  text: 'My Profile',
                  color: '#fff'
                },
                backButton: {
                  color: '#fff'
                }
              }
            }
          }
        }
      ],
      options: {
        animations: {
          setRoot: {
            waitForRender: true,
            scaleX: { from: 0, to: 1, duration: 100, interpolation: 'decelerate' },
            scaleY: { from: 0, to: 1, duration: 100, interpolation: 'decelerate' }
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
