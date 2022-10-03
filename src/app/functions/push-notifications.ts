import { PushNotifications } from '@capacitor/push-notifications'
import { Store } from '../stores/store'
import { getItem, getMap, setItem, setMap } from './local-storage'
import { Router } from '@angular/router'
import { DateTime } from 'luxon'
import { ToastrService } from 'ngx-toastr'
import { take } from 'rxjs'
import {
  LocalNotificationDescriptor,
  LocalNotifications,
} from '@capacitor/local-notifications'
import { User } from './types'

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

  await LocalNotifications.addListener(
    'localNotificationActionPerformed',
    (res) => {
      const id = res.notification.extra.peerId
      if (id) {
        router.navigate(['/home/peer/' + id])
      }
    }
  )

  await PushNotifications.addListener('pushNotificationReceived', (res) => {
    const id = res.data.peerId
    const displayName = res.data.peerDisplayName
    if (id && displayName) {
      // TODO: Don't show toastr if we scroll to new message (?)
      toastr
        .info('New message from ' + displayName)
        .onTap.pipe(take(1))
        .subscribe(() => {
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
    id: 'follow-up',
    name: 'Follow-up',
    importance: 4, // High priority
    visibility: -1, // Secret
    lights: true,
    lightColor: '#FFC409',
    vibration: true,
  })
  await PushNotifications.createChannel({
    id: 'messages',
    name: 'Messages',
    importance: 4, // High priority
    visibility: -1, // Secret
    lights: true,
    lightColor: '#FFC409',
    vibration: true,
  })
  await PushNotifications.createChannel({
    id: 'reminders',
    name: 'Reminders',
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

export const scheduleNotification = async (peer: User) => {
  const notifications = [
    {
      id: Math.floor(Math.random() * 100000000),
      channelId: 'follow-up',
      schedule: {
        at: DateTime.now().plus({ hours: 1 }).toJSDate(),
      },
      extra: {
        peerDisplayName: peer.nickname || peer.displayName,
        peerId: peer._id,
      },
      title: peer.nickname || peer.displayName + ' is waiting for a reply',
      body: 'Tap here to send a message',
      group: 'peer-' + peer._id,
    },
  ]
  const res = await LocalNotifications.schedule({ notifications })
  if (res.notifications.length > 0) {
    const map = getMap('scheduled_notifications') as Map<
      string,
      LocalNotificationDescriptor
    >
    if (map.has(peer._id)) {
      await LocalNotifications.cancel({ notifications: [map.get(peer._id)] })
    }
    map.set(peer._id, res.notifications[0])
    setMap('scheduled_notifications', map)
  }
}

export const cancelNotification = async (peerId: string) => {
  const map = getMap('scheduled_notifications') as Map<
    string,
    LocalNotificationDescriptor
  >
  if (map.has(peerId)) {
    await LocalNotifications.cancel({ notifications: [map.get(peerId)] })
    map.delete(peerId)
    setMap('scheduled_notifications', map)
  }
}
