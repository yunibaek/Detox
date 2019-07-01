#!/bin/bash -e

npm install -g lerna@2.4.0
npm install -g react-native-cli
npm install -g detox-cli
HOMEBREW_NO_INSTALL_CLEANUP=1 HOMEBREW_NO_AUTO_UPDATE=1 brew install ruby
git submodule update --init --recursive
