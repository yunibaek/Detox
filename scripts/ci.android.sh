#!/bin/bash -e

source $(dirname "$0")/ci.sh

pushd detox/android
run_f "./gradlew test"
popd

pushd detox/test
# Workaround until react android issue will be fixed - react-native: 0.55
mv node_modules/react-native/ReactAndroid/release.gradle node_modules/react-native/ReactAndroid/release.gradle.bak
cp extras/release.gradle node_modules/react-native/ReactAndroid/

echo no | avdmanager create avd --force --name Nexus_5X_API_26  --abi x86_64 --device "Nexus 5X" -k "system-images;android-26;google_apis;x86_64"

run_f "npm run build:android"
run_f "npm run e2e:android -- --headless"
# run_f "npm run verify-artifacts:android"
popd
