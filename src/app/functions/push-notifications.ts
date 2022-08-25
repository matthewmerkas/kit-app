import { PushNotifications } from '@capacitor/push-notifications'

export const addListeners = async () => {
  await PushNotifications.addListener('registration', (token) => {
    console.log('Registration token: ', token.value)
  })

  await PushNotifications.addListener('registrationError', (err) => {
    console.error('Registration error: ', err.error)
    // TODO: Handle devices w/o Google Play Services (MISSING_INSTANCEID_SERVICE)
  })

  await PushNotifications.addListener(
    'pushNotificationReceived',
    (notification) => {
      console.log('Push notification received: ', notification)
    }
  )

  await PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (notification) => {
      console.log('Push notification action performed: ', notification)
      // TODO: Navigate to page corresponding to notification.data.peerId
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
