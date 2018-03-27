# Olympus App

This repository is for testing purposes only, do not use it for real deployment.

🔨🔨🔨UNDER CONSTRUCTION!⚡️⚡️⚡️

## MVP

- [x] basic ethereum wallet
- [x] kyber network integration

[MVP Milestone is here.](https://github.com/Olympus-Labs/OlympusApp/milestone/1)

## Config

```shell
// clean up and install
watchman watch-del-all
rm -rf node_modules && rm shim.js && npm install
rm -fr $TMPDIR/react-*

// link modules
react-native link react-native-vector-icons

// hack
npm i --save-dev mvayngrib/rn-nodeify
./node_modules/.bin/rn-nodeify --hack --install
```

## Run

```shell
// MVP iOS only
react-native run-ios
```

## Troublesome

a). Cant compile with xCode get the error

`library not found for -lGoogleToolboxForMac clang: error: linker command failed with exit code 1 (use -v to see invocation)]`

1. Install pod
```shell
// Install pod
brew install pod
// Run pod, with international connection (make sure you can connect google)
pod update
// Verify
pod install
```

2. Open the project file with xCode `Olympus.xcworkspace`, not `Olympus.xcodeproj`. Run from this one.

## LAYOUT

 - Colors

Through the app in order to keep the same styling, don't hardcode any color, but use the colors
available in Colors Constant file.

- In order to keep consitency in the fonts, use Text and TextInput form layout border.
