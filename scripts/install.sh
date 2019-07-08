#!/bin/bash -e
echo node -v $(node -v)
npm install -g lerna@2.4.0
npm install -g react-native-cli
npm install -g detox-cli
git submodule update --init --recursive
