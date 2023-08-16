#!/bin/bash

# only run as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root"
    exit
fi

echo "Installing BigBlueButton-MP4-Transcription"

# Transcription
cd transcription
sudo bash bbb-transcription-install.sh
cd ..

# mp4
cd mp4
sudo bash bbb-mp4-install.sh

echo "Updating index.html of recording page to add transcript/mp4 button."
if [ ! -f "/var/bigbluebutton/playback/presentation/2.3/index_default.html" ]; then

    echo "index_default.html doesn't exist. Proceed with replacing."

    # index_default.html is backup of default index.html that comes with fresh bbb install. If you want to remove, rename index_default.html to index.html.
    cp /var/bigbluebutton/playback/presentation/2.3/index.html /var/bigbluebutton/playback/presentation/2.3/index_default.html

    # copying bigbluebutton-mp4-transcript-button.js
    cp bigbluebutton-mp4-transcript-button.js /var/bigbluebutton/playback/presentation/2.3/
    # Add js tag just befor closing body tag
    sed -i 's/<\/body>/<script src="\/playback\/presentation\/2.3\/bigbluebutton-mp4-transcript-button.js"><\/script><\/body>/g' /var/bigbluebutton/playback/presentation/2.3/index.html
else
    echo "index_default.html exists. Skipping replacing."
fi
