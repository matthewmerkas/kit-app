# KIT Mobile App

## Development server

Run `ionic serve` for a dev server. Navigate to `http://localhost:5000/`. The app will automatically reload if you change any of the source files.

## Build

Run `ionic build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Simulate

`npx cap run android`

## Deploy

`ionic build --prod`

`cordova-res android --skip-config --copy`

`npx cap sync`

`npx cap open android`
