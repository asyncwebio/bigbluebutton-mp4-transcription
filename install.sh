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
