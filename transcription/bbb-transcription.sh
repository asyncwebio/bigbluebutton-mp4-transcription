#!/bin/bash

while [[ $# -gt 0 ]]; do
    case "$1" in
    --file-name)
        FILE_NAME="$2"
        shift 2
        ;;
    --meeting-id)
        MEETING_ID="$2"
        shift 2
        ;;
    --language-code)
        LANGUAGE_CODE="$2"
        shift 2
        ;;
    --callback-url)
        CALLBACK_URL="$2"
        shift 2
        ;;
    --transcription-url)
        TRANSCRIPTION_URL="$2"
        shift 2
        ;;
    --meeting-name)
        MEETING_NAME="$2"
        shift 2
        ;;
    --start-time)
        START_TIME="$2"
        shift 2
        ;;
    --end-time)
        END_TIME="$2"
        shift 2
        ;;
    *)
        echo "Unknown option: $1" | systemd-cat -p warning -t bbb-transcribe
        exit 1
        ;;
    esac
done

echo "Transcribing $MEETING_ID" | systemd-cat -p warning -t bbb-transcribe

docker run -d --rm --name $NAME \
    -v /var/bigbluebutton/transcripts:/usr/src/app/transcripts \
    -v /var/bigbluebutton/published/presentation/$MEETING_ID:/usr/src/app/presentation/$MEETING_ID \
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
