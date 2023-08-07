#!/bin/bash

FILE_NAME=$1
MEETING_ID=$2
LANGUAGE_CODE=$3
CALLBACK_URL=$4
TRANSCRIPTION_URL=$5
MEETING_NAME=$6
START_TIME=$7
END_TIME=$8
echo "Transcribing $MEETING_ID" | systemd-cat -p warning -t bbb-transcribe

docker run --rm \
    --name $MEETING_ID_transcribe \
    -v /var/bigbluebutton/transcripts:/usr/src/app/transcripts \
    -v /var/www/bigbluebutton-mp4-transcription/transcription/logs:/usr/src/app/logs \
    -v /var/www/bigbluebutton-mp4-transcription/transcription/auth-key.json:/usr/src/app/auth-key.json \
    --env FILE_NAME=$FILE_NAME \
    --env MEETING_ID=$MEETING_ID \
    --env LANGUAGE_CODE=$LANGUAGE_CODE \
    --env CALLBACK_URL=$CALLBACK_URL \
    --env TRANSCRIPTION_URL=$TRANSCRIPTION_URL \
    --env MEETING_NAME=$MEETING_NAME \
    --env START_TIME=$START_TIME \
    --env END_TIME=$END_TIME \
    manishkatyan/bbb-transcription
