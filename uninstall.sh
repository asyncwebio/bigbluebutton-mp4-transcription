#!/bin/bash

echo "Uninstalling BigBlueButton-MP4-Transcription"
sudo rm /usr/local/bigbluebutton/core/scripts/post_publish/bbb_transcription.rb
sudo rm /usr/local/bigbluebutton/core/scripts/post_publish/bbb_mp4.rb

sudo rm -rf /usr/local/bigbluebutton/core/scripts/post_publish/transcription_node_app

echo "Removing transcription NGINX config"
sudo rm /etc/bigbluebutton/nginx/bbb-transcription.nginx
sudp rm /etc/bigbluebutton/nginx/bbb-mp4.nginx
sudo nginx -t && sudo nginx -s reload
