// Imports the Google Cloud client library
const { SpeechClient } = require('@google-cloud/speech');
const { Storage } = require('@google-cloud/storage')
const path = require('path')
const axios = require('axios')
const child_process = require('child_process');


const bucketName = 'bbb-transcription';
const serviceKey = path.join(__dirname, '/usr/src/app/auth-key.json')


// get file name from command line
const meetingId = process.env.MEETING_ID;
const languageCode = process.env.LANGUAGE_CODE;
const callbackUrl = process.env.CALLBACK_URL;
const transcriptionUrl = process.env.TRANSCRIPTION_URL;
const meetingName = process.env.MEETING_NAME;
const startTime = process.env.START_TIME;
const endTime = process.env.END_TIME;

const fileName = `presentation/${meetingId}/video/audio.wav`;
// Creates a client
const client = new SpeechClient({
    // get auth key json file from  current directory
    keyFilename: serviceKey
});

// Create a storage client
const storage = new Storage({
    keyFilename: serviceKey
})

const bucket = storage.bucket(bucketName);


const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: "44100",
    languageCode: languageCode || 'en-US',
    audioChannelCount: 2,
    enableAutomaticPunctuation: true,
};

async function sendCallback() {
    try {
        const response = await axios.post(callbackUrl, {
            status: "success",
            meetingId,
            meetingName,
            startTime,
            endTime,
            transcriptionUrl
        })
        // check if the response is status code is in between 200 and 299

        if (response.status < 200 || response.status > 299) {
            //log the error status
            child_process.execSync(`echo ${JSON.stringify({
                status: "success",
                meetingId,
                statusCode: response.status
            })} >> logs / callback - error.log`)
        }
        else {
            // log the success status
            child_process.execSync(`echo ${JSON.stringify({
                status: "success",
                meetingId,
                statusCode: response.status
            })
                } >> logs / callback - success.log`)
        }

    } catch (error) {
        console.error(error)
        if (error.response) {
            child_process.execSync(`echo ${JSON.stringify({
                status: "error",
                meetingId,
                statusCode: error.response.status,
                error: error.response.data
            })
                } >> logs / callback - error.log`)
        }
        else {
            child_process.execSync(`echo ${JSON.stringify({
                status: "error",
                meetingId,
                error: error.message
            })
                } >> logs / callback - error.log`)
        }
    }
}

async function main() {
    try {
        await bucket.upload(fileName, {
            destination: `audios / ${meetingId}.wav`,
        })

        const request = {
            config: config,
            audio: {
                uri: `gs://${bucketName}/audios/${meetingId}.wav`,
            },

            outputConfig: {
                gcsUri: `gs://${bucketName}/transcriptions/${meetingId}.json`,
            },

            model: "default",
            processingStrategy: "DYNAMIC_BATCH"
        };

        const [operation] = await client.longRunningRecognize(request)
        const [response] = await operation.promise();
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        if (transcription) {
            child_process.execSync(`mkdir -p transcripts/${meetingId}`)
            child_process.execSync(`echo ${transcription} >> transcripts/${meetingId}/transcript.txt`)
        }

        // send callback
        if (callbackUrl) {
            await sendCallback()
        }

        // delete audio file
        await storage.bucket(bucketName).file(`audios/${meetingId}.wav`).delete()

        // delete transcription file
        await storage.bucket(bucketName).file(`transcriptions/${meetingId}.json`).delete()
    } catch (error) {

        console.error(error)
        child_process.execSync(`echo ${JSON.stringify({
            status: "error",
            meetingId,
            error: error.message
        })} >> logs/transcription-error.log`)
    }
}

main().catch(() => { });



