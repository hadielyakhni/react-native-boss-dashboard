import { firebase } from '@react-native-firebase/database'
import { Navigation } from 'react-native-navigation'
import registerScreens from './src/navigation/screens'

console.disableYellowBox = true

firebase.database().setPersistenceEnabled(true)

registerScreens()

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'first'
      }
    }
  })
})

