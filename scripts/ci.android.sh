#!/bin/bash -e

if [[ "$TRAVIS" != "true" ]]; then
    # Approve unapproved SDK licenses
    yes | $ANDROID_HOME/tools/bin/sdkmanager --licenses
fi

source $(dirname "$0")/ci.sh

### Native library unit-tests
pushd detox/android
run_f "./gradlew --version"
run_f "./gradlew test"
popd

### Build
pushd detox/test
# Workaround until react android issue will be fixed - react-native: 0.55
mv node_modules/react-native/ReactAndroid/release.gradle node_modules/react-native/ReactAndroid/release.gradle.bak
cp extras/release.gradle node_modules/react-native/ReactAndroid/

run_f "npm run build:android"
popd

### Wait for emulator
#if [[ "$TRAVIS" == "true" ]]; then
#    run_f "$(dirname "$0")/ci.android-waitforemulator.sh"
#fi

### Run e2e's
pushd detox/test
run_f "npm run e2e:android-ci"

### Coverage
cp coverage/lcov.info coverage/e2e.lcov
# run_f "npm run verify-artifacts:android"
popd
