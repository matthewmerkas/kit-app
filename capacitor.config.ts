import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.merkasoft.kit',
  appName: 'KIT',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ['sound'],
    },
    SplashScreen: {
      launchAutoHide: false,
    },
  },
}

export default config
