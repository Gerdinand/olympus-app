# Hora
Hora, Olympus Wallet.

🔨🔨🔨UNDER CONSTRUCTION!⚡️⚡️⚡️

## MVP

- [ ] bip39 mnemonic
- [ ] bip44 HDWallet
- [ ] basic ethereum wallet
- [ ] kyber integration

[MVP Milestone is here.](https://github.com/Olympus-Labs/Hora/milestone/1)

## Config

```shell
// clean up and install
watchman watch-del-all
rm -rf node_modules && npm install
npm i --save react-native-vector-icons && react-native link react-native-vector-icons
rm -fr $TMPDIR/react-*

// hack
npm i --save-dev mvayngrib/rn-nodeify
./node_modules/.bin/rn-nodeify --hack --install
```

## Run

```shell
react-native run-ios
// or
react-native run-android
```
