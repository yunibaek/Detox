#!/bin/bash -e

cat $BASH_ENV

export NVM_DIR="/opt/circleci/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install v10.15.3
nvm alias default v10.15.3
echo node -v $(node -v)

# Approve unapproved SDK licenses
yes | $ANDROID_HOME/tools/bin/sdkmanager --licenses

source $(dirname "$0")/ci.sh

pushd detox/android
run_f "./gradlew test"
popd

pushd detox/test

run_f "npm run build:android"
run_f "npm run e2e:android-ci"
cp coverage/lcov.info coverage/e2e.lcov
# run_f "npm run verify-artifacts:android"
popd
