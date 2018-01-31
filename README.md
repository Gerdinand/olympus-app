# Olympus App

This repository is for testing purposes only, do not use it for real deployment.

🔨🔨🔨UNDER CONSTRUCTION!⚡️⚡️⚡️

## MVP

- [x] basic ethereum wallet
- [x] kyber network integration

[MVP Milestone is here.](https://github.com/Olympus-Labs/Hora/milestone/1)

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
