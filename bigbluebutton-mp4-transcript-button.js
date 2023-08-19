const url = new URL(window.location.href);
const origin = url.origin;
const recordingId = url.pathname.split("/")[4];
const mp4_url = `${origin}/recording/${recordingId}.mp4`;
const transcript_url = `${origin}/transcripts/${recordingId}/transcript.txt`;

async function if_url_exists(url) {
    try {
        //  check 200 status code using Head request
        const res = await fetch(url, {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-cache",
        })
        return res.status == 200;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const downloadIcon = `<svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

const transcriptIcon = `<svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 16C5 15.4477 5.44772 15 6 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H6C5.44772 17 5 16.5523 5 16Z" fill="#fff"></path> <path d="M18 11C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13H10C9.44772 13 9 12.5523 9 12C9 11.4477 9.44772 11 10 11H18Z" fill="#fff"></path> <path d="M16 16C16 15.4477 16.4477 15 17 15H18C18.5523 15 19 15.4477 19 16C19 16.5523 18.5523 17 18 17H17C16.4477 17 16 16.5523 16 16Z" fill="#fff"></path> <path d="M7 11C7.55228 11 8 11.4477 8 12C8 12.5523 7.55228 13 7 13H6C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11H7Z" fill="#fff"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M4 3C2.34315 3 1 4.34315 1 6V18C1 19.6569 2.34315 21 4 21H20C21.6569 21 23 19.6569 23 18V6C23 4.34315 21.6569 3 20 3H4ZM20 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44771 20.5523 5 20 5Z" fill="#fff"></path> </g></svg>`

function dowload_button() {
    var element = document.getElementsByClassName("vjs-control-bar");
    var div = document.createElement("div");
    var a = document.createElement("a");
    var span = document.createElement("span");
    a.setAttribute("href", mp4_url);
    a.setAttribute("target", "_blank");
    a.style.cssText = "text-decoration: none;color: white;";
    div.classList = "vjs-remaining-time vjs-time-control vjs-control";
    a.innerHTML = downloadIcon;
    span.className = "";
    span.appendChild(a);
    div.appendChild(span);
    element[0].appendChild(div);
}
function transcript_button() {
    var element = document.getElementsByClassName("vjs-control-bar");
    var div = document.createElement("div");
    var a = document.createElement("a");
    var span = document.createElement("span");
    a.setAttribute("href", transcript_url);
    a.setAttribute("target", "_blank");
    a.style.cssText = "text-decoration: none;color: white;";
    div.classList = "vjs-remaining-time vjs-time-control vjs-control";
    a.innerHTML = transcriptIcon;
    span.className = "";
    span.appendChild(a);
    div.appendChild(span);
    element[0].appendChild(div);
}

function check_mp4() {
    if_url_exists(mp4_url).then((exists) => {
        console.log("MP4 present? :", exists);

        if (exists) {
            dowload_button();
            console.log("Added Download button ");
        }
    }).catch((err) => {
        console.log(err);
    })
}
function check_transcription() {
    if_url_exists(transcript_url).then((exists) => {
        console.log("Transcript present? :", exists);

        if (exists) {
            transcript_button();
            console.log("Added Transcript button ");
        }
    }).catch((err) => {
        console.log(err);
    })
}

const isTimeOut = false
let timer

const checkElement = async (selector) => {

    timer = setTimeout(() => {
        isTimeOut = true
        console.log('Time out')
    }, 10000);

    while (document.querySelector(selector) === null && !isTimeOut) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    clearTimeout(timer);
    return document.querySelector(selector);
};
checkElement(".vjs-control-bar").then((selector) => {
    if (selector) {
        console.log('Found "vjs-control-bar" \n Adding Download button..');
        check_mp4();
        check_transcription();
    }
});
