#!/bin/bash

# Stop any running processes
echo "Stopping any running processes..."
pkill -f "expo"
pkill -f "node"

# Clear watchman watches
echo "Clearing Watchman watches..."
watchman watch-del-all || true

# Clear Expo cache
echo "Clearing Expo cache..."
rm -rf $TMPDIR/metro-cache
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/haste-*
rm -rf $TMPDIR/metro-*

# Clear node modules (optional - uncomment if needed)
# echo "Removing node_modules..."
# rm -rf ./node_modules
# echo "Reinstalling node modules..."
# npm install

# Clear the React Native packager cache
echo "Clearing React Native packager cache..."
rm -rf .expo/
rm -rf ./ios/build
rm -rf ./android/build

# Start the app
echo "Starting the app with a clean slate..."
expo start --clear

echo "Cache cleared and app restarted!" 