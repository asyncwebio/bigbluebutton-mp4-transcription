// Imports the Google Cloud client library
const { SpeechClient } = require('@google-cloud/speech');
const { Storage } = require('@google-cloud/storage')
const path = require('path')


const bucketName = 'bbb-transcription';
const serviceKey = path.join(__dirname, './auth-key.json')


// get file name from command line
const fileName = process.argv[2];
const meetingId = process.argv[3];
const languageCode = process.argv[4];

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

async function main() {
    try {
        await bucket.upload(fileName, {
            destination: `audios/${meetingId}.wav`,
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
        process.stdout.write(JSON.stringify({
            status: 'completed',
            text: transcription
        }))

        // delete audio file
        await storage.bucket(bucketName).file(`audios/${meetingId}.wav`).delete()

        // delete transcription file
        await storage.bucket(bucketName).file(`transcriptions/${meetingId}.json`).delete()
    } catch (error) {
        process.stdout.write(JSON.stringify({
            status: 'error',
            erorr: error.message
        }))
    }
}

main().catch(() => { });



