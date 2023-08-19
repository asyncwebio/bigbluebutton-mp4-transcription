#!/bin/bash

sudo cp -r bbb_transcription.rb /usr/local/bigbluebutton/core/scripts/post_publish/bbb_transcription.rb
sudo mkdir -p /var/bigbluebutton/transcripts
sudo chown -R bigbluebutton:bigbluebutton /var/bigbluebutton/transcripts
cat transcription.nginx | sudo tee /etc/bigbluebutton/nginx/bbb-transcription.nginx
sudo nginx -t && sudo nginx -s reload

# Pulling Docker image.

echo "Pulling Docker image  manishkatyan/bbb-transcription"

sudo docker pull manishkatyan/bbb-transcription
