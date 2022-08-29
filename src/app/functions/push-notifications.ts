import { PushNotifications } from '@capacitor/push-notifications'
import { Store } from '../stores/store'
import { getItem, setItem } from './local-storage'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { take } from 'rxjs'

export const addListeners = async (
  router: Router,
  store?: Store,
  toastr?: ToastrService
) => {
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
    const id = res.data.peerId
    const displayName = res.data.peerDisplayName
    if (id && displayName) {
      // TODO: Don't show toastr if we scroll to new message (?)
      toastr
        .info('New message from ' + displayName)
        .onTap.pipe(take(1))
        .subscribe(() => {
          console.log('tap registered')
          router.navigate(['/home/peer/' + id])
        })
    }
  })

  await PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (res) => {
      const id = res.notification.data.peerId
      if (id) {
        router.navigate(['/home/peer/' + id])
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
