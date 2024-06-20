const hamburger = document.querySelector(".hamburger");
const headerRight = document.querySelector(".header-right");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    headerRight.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    headerRight.classList.remove("active");
}))

document.addEventListener('DOMContentLoaded', (event) => {
    const texts = document.querySelector('.texts');
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition


    window.botpressWebChat.init({
        "composerPlaceholder": "Hi! How can i help you",
        "botName": "IOAGPL Bot",
        "botId": "9fc434b6-d151-4d04-897a-51d6cc161541",
      "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
      "messagingUrl": "https://messaging.botpress.cloud",
      "clientId": "9fc434b6-d151-4d04-897a-51d6cc161541",
      "webhookId": "931c5214-6895-48cf-b9d5-eae7538a1e6c",
        "lazySocket": true,
        "showBotInfoPage": true,
        "avatarUrl": "https://play-lh.googleusercontent.com/XMWHlx11Yfd7q1624ic0BBMgB8cJ-c3usY_p3ZneMGUBJZagK-uoeyfXmXeOeuA0b3c",
        "phoneNumber": "1800 2335 5666",
        "privacyPolicy": "https://ioagpl.com/privacy-policy/",
        "emailAddress": "info@ioagpl.com",
        "website": "https://ioagpl.com/",
        'enableConversationDeletion': true,
        'stylesheet': 'https://webchat-styler-css.botpress.app/prod/code/c43a9f83-2e98-4493-858e-a3b19076c01d/v73528/style.css',
        'enableTranscriptDownload': true,
        'showCloseButton': true,
        "allowedOrigins": []
    });

    let ttsLang;
    var main = document.querySelector(".main");
    var secondary = document.querySelector(".scrollable-div");
    main.style.display = "none";
    // secondary.style.display = "none";

    window.botpressWebChat.onEvent(event => {

        if (event.type === 'TRIGGER' && event.value.ttsLang) {
            main.style.display = "flex";
            // secondary.style.display = "none";
            ttsLang = event.value.ttsLang;
            console.log("Language: " + event.value.ttsLang);
        }
        else if (event.type === 'TRIGGER' && event.value.botResponse) {
            // main.style.display = "flex";
            // secondary.style.display = "none";
            // main.style.display='block';
            let currentContent = transcriptionResult.innerHTML;
            // transcriptionResult.innerHTML = currentContent + '<p>Bot: ' + event.value.botResponse + '</p>';
            console.log(currentContent);
            console.log(event.value.botResponse);
            // synthesizeSpeech(event.value.botResponse);  
            let speech = new SpeechSynthesisUtterance();
            speech.pitch = 0.3;
            speech.rate = 1;
            let voices;
            voices = window.speechSynthesis.getVoices();
            speech.voice = voices[1];
            console.log(voices);
            speech.text = event.value.botResponse;
            window.speechSynthesis.speak(speech);
        }
        else {
            console.log("Something wrong :( ")
        }
    }, ['TRIGGER']);

    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");
    const transcriptionResult = document.getElementById("transcriptionResult");

    const recognition = new window.SpeechRecognition();
    // const recognition= new window.SpeechRecognition();
    let transcript = '';
    let interimTranscript = '';

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {

        // recognition = new webkitSpeechRecognition();

        recognition.continuous = true;

        recognition.interimResults = true;

        recognition.onstart = function () {

            startButton.disabled = true;

            stopButton.disabled = false;

            // transcriptionResult.innerHTML = '<p><b>Listening...</b></p>';

        };

        recognition.onerror = function (event) {
            console.error(event.error);
        };

        recognition.onend = function () {
            startButton.disabled = false;
            stopButton.disabled = true;
        };

        recognition.onresult = function (event) {
            interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }

            }

        };
    }
    else {
        alert("Your browser does not support the Web Speech API");
    }
    startButton.addEventListener('click', function () {
        transcript = "";
        recognition.lang = ttsLang;
        startButton.innerHTML = 'Listening...';
        recognition.start();

    });


    stopButton.addEventListener('click', function () {
        recognition.stop();
        const combinedTranscript = transcript + interimTranscript;
        console.log("Transcript:" + combinedTranscript);
        console.log(typeof (combinedTranscript))
        main.style.display = "none";
        startButton.innerHTML = 'Start Listening';
        window.botpressWebChat.sendPayload({
            type: 'trigger',
            payload: { sttTranscript: combinedTranscript }
        });
    });
});


var synth = window.speechSynthesis;

synth.onvoiceschanged = function () {
    var voices = synth.getVoices();
    voices.forEach(function (voice, index) {
        // console.log("Voice " + index + ":", voice.name);
    });
};
