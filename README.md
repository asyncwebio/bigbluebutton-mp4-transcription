# BigBlueButton-MP4-Transcription Plugin

The BigBlueButton-MP4-Transcription Plugin is a powerful tool that enables automatic transcription and mp4 converstion of recorded sessions in BigBlueButton. With this plugin, you can easily convert your recorded sessions into text and mp4 formate, making it more accessible.

## Table of Contents

- [💡 Features](#-features)
- [📋 Requirements](#-requirements)
- [📦 Installation](#-installation)
- [🔎 How it works](#-how-it-works)
- [📖 Usage](#-usage)
- [🗑️ Uninstall](#%EF%B8%8F-uninstall)

## 💡 Features

- Automatic transcription and mp4 convertion of recorded sessions
- Seamless integration with Google Speech-to-Text
- Easy installation and configuration
- Transcribed text avaibale via API
- Supports a variety of languages and accents
- Callbacks for custom integrations

## 📋 Requirements

- BigBlueButton server 2.6 or later
- Playback of recordings on ios enabled (see [here](https://docs.bigbluebutton.org/administration/customize#enable-playback-of-recordings-on-ios) for more details)
- Google Cloud Speech-to-Text APIs enabled
- Google Cloud Storage APIs enabled
- Google Cloud Storage bucket with name `bbb-transcription` (for storing audio files and transcripts)
- Google Cloud credentials (in json format)

## 📦 Installation

To install the BigBlueButton Transcription Plugin, follow these steps:

1. Clone the repository to your BigBlueButton server:

   ```bash
   cd /var/www
   git clone https://github.com/AsyncWeb/bigbluebutton-mp4-transcription.git
   ```

2. Navigate to the plugin directory

   ```bash
   cd bigbluebutton-mp4-transcription
   ```

3. Add google auth credentials to the `transcription_node_app` directory:

   ```bash
   cp transcription_node_app/auth-key.json.sample transcription_node_app/auth-key.json

   # get the credentials from the Google Cloud Console
   # edit auth-key.json and add the your credentials
   ```

   You can find the credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

   - Login to your Google Cloud Console.
   - Create a new project or select an existing one.
   - Go to the `APIs & Services`
   - Click on `Enable APIs and Services` and enable `Cloud Speech-to-Text API` and `Cloud Storage API`.
   - Goto `Credentials` and click on `Create Credentials`.
   - Follow the steps and create a new service account.
   - Download the credentials in json format and copy the contents to `auth-key.json` file.

4. Install the plugin:

   ```bash
   bash install.sh
   ```

## 🔎 How it works

Transcription: Plugin extracts the audio from the recorded sessions and uploads it to Google Cloud Storage. The audio is then transcribed using Google Speech-to-Text. The transcript is then saved in a Google Cloud Storage. Once the process is complete, the plugin calls the `bbb-transcription-ready-url` with the transcript URL.

MP4: Plugin converts the recorded session to mp4 format using the `ffmpeg` library. Once the process is complete, the plugin calls the `bbb-mp4-ready-url` with the mp4 URL.

<br /> <br />
<img alt="bigbluebutton-mp4-transcription"  src="/static/chart.png"/>
<br /> <br />
## 📖 Usage

1. You need to pass below meta tags while creating the meeting

   - `bbb-transcription-enabled`: Set this to `true` to enable transcription for the meeting. Default is `false`.
   - `bbb-mp4-enabled`: Set this to `true` to enable mp4 convertion of recording for the meeting. Default is `false`.

   - `bbb-transcription-ready-url` (optional): A URL that will be called when the transcription is ready. The URL will be called with the json payload with following parameters:

     ```
     meeting_name
     start_time
     end_time
     meeting_id
     transcription_url

     ```

   - `bbb-mp4-ready-url` (optional): The URL will be called with the json payload with following parameters when the mp4 conversion is complete:

     ```
      recordingId
      mp4Url

     ```

   - `bbb-transcription-source-language` (optional): The language spoken in the meeting. The value should be a valid language code. For example, `en-US` for English (United States), `en-GB` for English (United Kingdom), `fr-FR` for French (France), etc. You can check allowed language codes [here](https://cloud.google.com/speech-to-text/docs/languages).

2. You can access the transcript and mp4 of the meeting using the below url formats:

- Transcription:

  ```bash
  https://<your-bbb-server>/transcripts/<internal-meeting-id>/transcript.json
  ```

- MP4:
  ```bash
   https://<your-bbb-server>/recording/<internal-meeting-id>.mp4
  ```

## 🗑️ Uninstall

To uninstall the BigBlueButton-MP4-Transcription Plugin, run the following command:

```bash
cd /var/www/bigbluebutton-mp4-transcription
bash uninstall.sh
```

<br/><br/>

## 🚀 <a href="https://higheredlab.com" target="_blank">Ready to Transform Your Online Teaching Experience?</a>

Discover a new era of online learning with HigherEdLab's BigBlueButton hosting service.

With features ranging from crystal-clear HD video learning to interactive tools such as chat, poll, and presentations, we ensure that your virtual classrooms emulate the dynamic environment of physical ones.

Enjoy the benefits of AI with ChatGPT-powered quizzes and transcriptions that enhance the learning experience. With HigherEdLab, you can customize your virtual learning space with your own domain, logo, and colors to align with your institution's brand identity.

We also offer advanced user management, seamless integration options, and comprehensive analytics to give you complete control over your teaching platform.

Ready to embrace the next level of digital education?

<a href="https://higheredlab.com" target="_blank"><strong>Sign Up</strong></a> Now for HigherEdLab's BigBlueButton Hosting Service and transform the way you teach online.
