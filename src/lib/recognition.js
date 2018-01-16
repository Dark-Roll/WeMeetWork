"use strict";
import socket from "../socket";
import Assistant from '../components/left-field/Assistant'
import { setInterimResult, addRecognitionRecord } from "../actions/Actions";

let Recognition = {
    //MeetingActions, MeetingStore, socket, room
    createNew: Meeting => {
        //模組物件
        let recognizer = {};
        //模組接口的需求:Select選單物件、中途判定之文字輸出口、最終結果文字輸出口
        let isRecognizing = false;
        let shouldStop = false;
        let changeLanguage = false;
        let targetLanguage = "cmn-Hant-TW";
        let start_timestamp;
        let time = new Date();

        let recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        //************預設中文
        recognition.lang = "cmn-Hant-TW";
        //************直接開始
        recognition.start();


        recognizer.setLanguage = language => {
            console.log('有有被按到了')
            let changeLanguage = true
            let targetLanguage = language
            recognizer.stop();
        };

        recognizer.stop = language => {
            shouldStop = true
            recognition.stop();
        };

        recognition.onstart = () => {
            console.log("Recognition On Start");
            start_timestamp = time.getTime();
            isRecognizing = true;
        };

        recognition.onerror = event => {
            if (event.error == "no-speech") {
                console.log("Recognition On Error，偵測不到麥克風訊號，請調整裝置的設定。");
                isRecognizing = false;
                shouldStop = false;
            }
            if (event.error == "audio-capture") {
                console.log("Recognition On Error，偵測不到麥克風，請正確安裝。");
                isRecognizing = false;
                shouldStop = true;
            }
            if (event.error == "not-allowed") {
                isRecognizing = false;
                shouldStop = true;
                if (event.timeStamp - start_timestamp < 100) {
                    console.log(
                        "Recognition On Error，麥克風的權限被阻擋，請至chrome://settings/contentExceptions#media-stream更改設定"
                    );
                } else {
                    console.log("Recognition On Error，存取麥克風被拒。");
                }
            }
            // Meeting.setState({
            //     isRecognizing:false,
            //     recognitionResult:""
            // })
        };

        recognition.onend = () => {
            console.log("recognition On end");
            isRecognizing = false;
            console.log(changeLanguage)
            console.log(shouldStop)
            if (!shouldStop) {
                console.log("recognition Start again");
                recognition.start();
            }
            if (changeLanguage) {
                recognition.lang = targetLanguage;
                changeLanguage = false;
                targetLanguage = "cmn-Hant-TW"
                recognition.start();
            }
            shouldStop = false;
        };

        recognition.onnomatch = () => {
            console.log("有聽到!但辨識不出來..");
        };
        recognition.onresult = event => {
            // console.log("有聽到有聽到!");
            let interim_transcript = "";
            //版本過舊的情況
            // if (typeof(event.results) == 'undefined') {
            //     recognition.onend = null;
            //     recognition.stop();
            //     Meeting.setState({
            //         isRecognizing:false
            //     })
            //     return;
            // }

            //自定義時間格式:Hour-Minute
            let tempTime =
                (time.getHours() < 1 ? "0" : "") +
                time.getHours() +
                ":" +
                (time.getMinutes() < 10 ? "0" : "") +
                time.getMinutes();

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    Assistant.useAssistant(event.results[i][0].transcript, Meeting, Meeting.closeAll);
                    Meeting.props.dispatch(
                        addRecognitionRecord({
                            sendTime: tempTime,
                            name: Meeting.props.userName,
                            userID: Meeting.props.localUserID,
                            text: event.results[i][0].transcript
                        })
                    );
                    socket.emit("recognitionRecord", {
                        sendTime: tempTime,
                        name: Meeting.props.userName,
                        userID: Meeting.props.localUserID,
                        text: event.results[i][0].transcript
                    });
                    Meeting.props.dispatch(setInterimResult(""));
                } else {
                    interim_transcript += event.results[i][0].transcript;
                    Meeting.props.dispatch(
                        setInterimResult(interim_transcript)
                    );
                }
            }
        };
        return recognizer;
    }
};

module.exports = Recognition;
