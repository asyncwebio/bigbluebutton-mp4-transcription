#!/bin/bash

echo "Uninstalling BigBlueButton Transcription"
sudo rm /usr/local/bigbluebutton/core/scripts/post_publish/bbb_transcription.rb

sudo rm -rf /usr/local/bigbluebutton/core/scripts/post_publish/transcription_node_app

echo "Removing transcription NGINX config"
sudo rm /etc/bigbluebutton/nginx/transcription.nginx
sudo nginx -t && sudo nginx -s reload
