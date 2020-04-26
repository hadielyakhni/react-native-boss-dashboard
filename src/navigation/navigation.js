import { Navigation } from 'react-native-navigation'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { isRTL } from '../utils/i18n'

export const goToWalkThrough = systemTheme => Navigation.setRoot({
  root: {
    stack: {
      children: [
        {
          component: {
            name: 'walkthrough',
            passProps: {
              systemTheme
            }
          }
        }
      ],
      options: {
        topBar: {
          visible: false
        }
      }
    }
  }
})

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
        animations: {
          setRoot: {
            waitForRender: true,
            alpha: {
              from: 0,
              to: 1,
              duration: 200
            }
          }
        },
        passProps: {
          isFromWalkThrough: true
        },
        topBar: {
          visible: false
        }
      }
    }
  }
})

export const goToMain = () => {
  Promise.all([
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
                  text: 'Tasks',
                  selectTabOnPress: false
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
                  text: 'Employees',
                  selectTabOnPress: false
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
                  text: 'Wallet',
                  selectTabOnPress: false
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
                    name: 'settings'
                  }
                }
              ],
              options: {
                bottomTab: {
                  icon: personIcon,
                  text: 'Settings',
                },
                topBar: {
                  visible: false
                }
              }
            }
          }
        ],
        options: {
          layout: {
            direction: isRTL() ? 'rtl' : 'ltr'
          },
          animations: {
            setRoot: {
              waitForRender: true
            }
          },
          bottomTabs: {
            preferLargeIcons: true,
            titleDisplayMode: 'alwaysHide'
          }
        }
      }
    }
  }))
}
