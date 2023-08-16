#!/bin/bash

# Load .env variables
set -a
source <(cat .env |
    sed -e '/^#/d;/^\s*$/d' -e "s/'/'\\\''/g" -e "s/=\(.*\)/='\1'/g")
set +a

MEETING_ID=$1
CALLBACK_URL=$2
echo "converting $MEETING_ID to mp4" | systemd-cat -p warning -t bbb-mp4

docker run --rm -d --name $MEETING_ID \
    -v /var/www/bigbluebutton-default/recording:/usr/src/app/processed \
    -v /home/ubuntu/bigbluebutton-mp4-transcription/mp4/logs:/usr/src/app/logs \
    --env REC_URL=https://$BBB_DOMAIN_NAME/playback/presentation/2.3/$MEETING_ID \
    --env CALLBACK_URL=$CALLBACK_URL \
    manishkatyan/bbb-mp4
