# KIT Mobile App

## Development server

Run `ionic serve` for a dev server. Navigate to `http://localhost:8100/`. The app will automatically reload if you change any of the source files.

## Build

Run `ionic build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Simulate

`npx cap run android`

`ionic capacitor run android --l --external`

## Deploy

`./build.sh`

or run each command manually:

`ionic build --prod`

`cordova-res android --skip-config --copy`

`npx cap sync`

`npx cap open android`

### Notification Icons
[Create a notification icon](https://developer.android.com/studio/write/image-asset-studio#create-notification) with Image path `resources/android/icon-foreground.png`. Set Trim to Yes

### Android Hacks

#### NFC Plugin

Must modify `createPendingIntent()` in `android/capacitor-cordova-android-plugins/src/main/java/com/chariotsolutions/nfc/plugin/NfcPlugin.java`

Replace:

```
pendingIntent = PendingIntent.getActivity(activity, 0, intent, 0);
```

with:

```
int flags;
if (android.os.Build.VERSION.SDK_INT >= 23) {
  flags = PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
} else {
  flags = PendingIntent.FLAG_UPDATE_CURRENT;
}
pendingIntent = PendingIntent.getActivity(activity, 0, intent, flags);
```

If you're not updating native plugins, run `npx cap copy` instead of `npx cap sync` when building to prevent overwriting these changes

#### Capacitor Navigation Bar

Install node modules with `npm install --force` and replace `node_modules/@hugotomazi` folder with `modified_modules/@hugotomazi`

#### Capacitor Splash Screen

Comment line 98 in `node_modules/@capacitor/splash-screen/android/src/main/java/com/capacitorjs/plugins/splashscreen/SplashScreen.java`
