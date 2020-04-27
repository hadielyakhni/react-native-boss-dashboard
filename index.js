import { firebase } from '@react-native-firebase/database'
import { Navigation } from 'react-native-navigation'
import registerScreens from './src/navigation/screens'
import { I18nManager } from 'react-native'

I18nManager.allowRTL(false)
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