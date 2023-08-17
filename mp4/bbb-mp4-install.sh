#!/bin/bash

# Load .env variables
cp env-example .env
sed -i "s/BBB_DOMAIN_NAME=.*/BBB_DOMAIN_NAME=$(bbb-conf --secret | grep URL | cut -d'/' -f3)/g" .env

set -a
source <(cat .env |
  sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g")
set +a

chmod +x *.sh

echo "Adding bbb_mp4.rb"
cp -r bbb_mp4.rb /usr/local/bigbluebutton/core/scripts/post_publish/

sudo bash -c "echo 'location /recording { root    /var/www/bigbluebutton-default; }' > /usr/share/bigbluebutton/nginx/bbb-mp4.nginx"

sudo nginx -t && sudo nginx -s reload

#Pulling Docker image.
echo "Pulling Docker image  manishkatyan/bbb-mp4:v2"
docker pull manishkatyan/bbb-mp4:v2
