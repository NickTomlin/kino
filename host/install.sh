#!/bin/sh
# Copyright 2013 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

# we should just rewrite this in node :\
set -e

DIR="$( cd "$( dirname "$0" )" && pwd )"
if [ "$(uname -s)" = "Darwin" ]; then
  if [ "$(whoami)" = "root" ]; then
    TARGET_DIR="/Library/Google/Chrome/NativeMessagingHosts"
  else
    TARGET_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
  fi
else
  if [ "$(whoami)" = "root" ]; then
    TARGET_DIR="/etc/opt/chrome/native-messaging-hosts"
  else
    TARGET_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
  fi
fi

NODE_PATH=$1
HOST_NAME=com.nicktomlin.kino
SOURCE_HOST_PATH=$DIR/native-messaging-host
DEST_HOST_PATH=$DIR/native-messaging-host.initialized

# Create directory to store native messaging host.
mkdir -p "$TARGET_DIR"

# Copy native messaging host manifest.
cp "$DIR/$HOST_NAME.json" "$TARGET_DIR"

# ensure that the shebang line in the native message host
# is using the appropriate node path
# (otherwise this causes issues with permissions when chrome attempts to start it)
cp -p $SOURCE_HOST_PATH $DEST_HOST_PATH
sed -i -e '1s|.*|#!'$NODE_PATH'|' $DEST_HOST_PATH

# Update host path in the manifest.
ESCAPED_HOST_PATH=${DEST_HOST_PATH////\\/}
sed -i -e "s/HOST_PATH/$ESCAPED_HOST_PATH/" "$TARGET_DIR/$HOST_NAME.json"

# Set permissions for the manifest so that all users can read it.
chmod o+r "$TARGET_DIR/$HOST_NAME.json"

echo "Native messaging host $HOST_NAME has been installed at:\n$TARGET_DIR/$HOST_NAME.json"
