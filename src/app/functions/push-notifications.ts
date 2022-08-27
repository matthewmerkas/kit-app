import { PushNotifications } from '@capacitor/push-notifications'
import { Store } from '../stores/store'
import { getItem, setItem } from './local-storage'
import { Router } from '@angular/router'

export const addListeners = async (router: Router, store?: Store) => {
  await PushNotifications.addListener('registration', (token) => {
    store?.user.updateMe({ fcmToken: token.value }).subscribe()
  })

  await PushNotifications.addListener('registrationError', (err) => {
    console.error('Registration error: ', err.error)
    if (err.error.includes('MISSING_INSTANCEID_SERVICE')) {
      if (!getItem('gms_error_shown')) {
        store.ui.openAlert(
          'No Google Play Services',
          '',
          'Notifications will not work',
          ['OK']
        )
        setItem('gms_error_shown', true)
      }
    }
  })

  await PushNotifications.addListener('pushNotificationReceived', (res) => {
    // TODO: Emit push notification if new message is not in view
    console.log('Push notification received: ', res)
  })

  await PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (res) => {
      const peerId = res.notification.data.peerId
      if (peerId) {
        router.navigate(['/home/peer/' + peerId])
      }
    }
  )
}

export const createChannels = async () => {
  await PushNotifications.createChannel({
    id: 'messages',
    name: 'Messages',
    importance: 4, // High priority
    visibility: -1, // Secret
    lights: true,
    lightColor: '#FFC409',
    vibration: true,
  })
}

export const registerNotifications = async () => {
  const permStatus = await PushNotifications.requestPermissions()

  if (permStatus.receive === 'granted') {
    // Register with Apple / Google to receive push via APNS/FCM
    await PushNotifications.register()
  } else {
    // Show some error
  }
}
