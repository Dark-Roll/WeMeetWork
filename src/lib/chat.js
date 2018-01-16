"use strict";
import {
    gotLocalVideo,
    addRemoteStreamURL,
    delRemoteStreamURL,
    addParticipantConnection,
    turnOnUserAudio,
    toggleAudio,
    turnOnUserMedia,
    toggleUserMedia,
    setRemoteVideoState,
    setRemoteAudioState,
    addChatRecord
} from "../actions/Actions";
import socket from "../socket";

let Chat = {
    createNew: Meeting => {
        let fileChannels = {};
        let msgChannels = {};
        //取得使用者端的影像
        Chat.getUserMedia = () => {
            return new Promise((resolve, reject) => {
                navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                navigator.mediaDevices
                    .getUserMedia({
                        video: {
                            width: { max: 1024 },
                            height: { max: 776 }
                        },
                        audio: true
                    })
                    .then(stream => {
                        if (
                            stream.getVideoTracks().length > 0 ||
                            stream.getAudioTracks().length > 0
                        ) {
                            let videoURL = window.URL.createObjectURL(stream);
                            window.localStream = stream;
                            Meeting.props.dispatch(gotLocalVideo(videoURL),false);
                            if (stream.getVideoTracks().length > 0) {
                                Chat.startUserMedia();
                                Meeting.props.dispatch(turnOnUserMedia());
                                //Meeting.props.dispatch(toggleUserMedia());
                            }
                            if (stream.getAudioTracks().length > 0) {
                                Chat.startAudio();
                                Meeting.props.dispatch(turnOnUserAudio());
                                //Meeting.props.dispatch(toggleAudio());
                            }
                            resolve(stream);
                        } else {
                            console.log("沒聲音也沒影像欸QQ? 我覺得不行");
                            window.history.back();
                            reject("沒聲音也沒影像欸QQ? 我覺得不行");
                        }
                    })
                    .catch(e => {
                        //alert("無法偵測到您的麥克風或鏡頭，請重新授權，WeMeet基於WebRTC連線，必需要其中");
                        alert(e.name);
                        console.log(e.name);
                        console.log(e);
                        reject(e);
                        //window.history.back();
                    });
            });
        };

        Chat.startUserMedia = () => {
            window.localStream.getVideoTracks()[0].enabled = true;
        };

        Chat.toggleUserMedia = () => {
            window.localStream.getVideoTracks()[0].enabled = !window.localStream.getVideoTracks()[0]
                .enabled;
        };

        Chat.stopUserMedia = () => {
            let track = window.localStream.getVideoTracks()[0]
            track.stop()
        };

        Chat.startAudio = () => {
            window.localStream.getAudioTracks()[0].enabled = true;
        };

        Chat.toggleAudio = () => {
            window.localStream.getAudioTracks()[0].enabled = !window.localStream.getAudioTracks()[0]
                .enabled;
        };

        Chat.stopAudio = () => {
            let track = window.localStream.getAudioTracks()[0]
            track.stop()
        };

        //建立點對點連線物件，以及為連線標的創建影像視窗
        Chat.createPeerConnection = (
            isInitiator,
            config,
            remotePeer,
            socket
        ) => {
            let peerConn = new RTCPeerConnection(config);
            peerConn.onicecandidate = event => {
                if (event.candidate) {
                    //console.log('local端找到ice candidate>要傳出去: ' + JSON.stringify(event.candidate));
                    socket.emit(
                        "onIceCandidateA",
                        event.candidate,
                        Meeting.localUserID,
                        remotePeer
                    );
                }
            };
         
                if (Object.keys(window.localStream).length == 0 || window.localStream == null || window.localStream == undefined) {
                    console.log("沒視訊...")
                    Chat.getUserMedia()
                    .then(stream => {
                        window.localStream = stream
                        console.log("重新拿到stream了")
                        console.log(window.localStream)
                        peerConn.addStream(window.localStream);
                    }).catch(error=>{
                        console.log(error)
                    })
                } else {
                    console.log(window.localStream)
                    peerConn.addStream(window.localStream);
                }
            
            if (Meeting.props.candidateQueue) {
                if (Meeting.props.candidateQueue[Meeting.localUserID]) {
                    Meeting.props.candidateQueue[
                        Meeting.localUserID
                    ].map(candidateObj => {
                        peerConn.addIceCandidate(
                            new RTCIceCandidate(candidateObj)
                        );
                    });
                }
            }
            if (isInitiator) {
                //console.log('Createing Data Channel');
                //建立資料傳送頻道、訊息傳送頻道
                let fileChannel = peerConn.createDataChannel("files");
                console.log('已經建立通道: ' + fileChannel.label);
                let msgChannel = peerConn.createDataChannel("messages");
                console.log('已經建立通道: ' + msgChannel.label);
                fileChannels[remotePeer] = fileChannel;
                msgChannels[remotePeer] = msgChannel;

                //建立成功後，立即處理
                onDataChannelCreated(fileChannel);
                onDataChannelCreated(msgChannel);

                // //開啟通道後，初始化download物件
                // downloadAnchor.textContent = '';
                // downloadAnchor.removeAttribute('download');
                // if (downloadAnchor.href) {
                //     //停止連結的引用/作用
                //     URL.revokeObjectURL(downloadAnchor.href);
                //     downloadAnchor.removeAttribute('href');
                // }
            }
            //如果不是開房的，是加入別人的房間
            //如果有連線成功，會接到這個事件
            peerConn.ondatachannel = event => {
                console.log("收到通道訊息: ", event.channel.label);
                //加入別人建立的頻道
                if (event.channel.label == "files") {
                    //開啟通道後，初始化HTML元素
                    // downloadAnchor.textContent = '';
                    // downloadAnchor.removeAttribute('download');
                    // if (downloadAnchor.href) {
                    //     URL.revokeObjectURL(downloadAnchor.href);
                    //     downloadAnchor.removeAttribute('href');
                    // }
                    let fileChannel = event.channel;
                    fileChannels[remotePeer] = fileChannel;
                    console.log("已經加入通道: " + event.channel.label);
                    onDataChannelCreated(fileChannel);
                } else if (event.channel.label == "messages") {
                    let msgChannel = event.channel;
                    msgChannels[remotePeer] = msgChannel;
                    console.log("已經加入通道: " + event.channel.label);
                    onDataChannelCreated(msgChannel);
                }
            };
        
            // send any ice candidates to the other peer
            peerConn.onaddstream = event => {
                console.log("收到遠端加入影像");
                let url = URL.createObjectURL(event.stream);
                Meeting.props.dispatch(
                    addRemoteStreamURL({
                        [remotePeer]:remotePeer,
                        url: url,
                        stream: event.stream
                    })
                );
            };

            peerConn.onremovestream = event => {
                console.log("收到遠端離開");
                // console.log('Remote stream removed. Event: ', event);
                Meeting.props.dispatch(delRemoteStreamURL(remotePeer));
            };

            Meeting.props.dispatch(
                addParticipantConnection({
                    id: remotePeer,
                    connectionObj: peerConn
                })
            );
            return peerConn;
        };

        //建立資料傳遞頻道後，立即處理的函數
        let onDataChannelCreated = channel => {
            channel.onopen = () => {
                console.log("channel: " + channel.label + " 已經開啟! ");
            };
            channel.onmessage = event => {
                if (channel.label == "files") {
                    if (typeof event.data === "string") {
                        let received = new window.Blob(receiveBuffer);
                        receiveBuffer = [];
                        fileContainer = URL.createObjectURL(received);
                    }
                    //把每個ArrayBuffer都存在同一個陣列裡
                    receiveBuffer.push(event.data); //把資料push進陣列
                } else if (channel.label == "messages") {
                    let record = JSON.parse(event.data);
                    Meeting.props.dispatch(addChatRecord(record));
                }
            };
            channel.onerror = (error)=>{
                console.log("channel:" + channel.label + " 出了問題! " + error)
            }
        };

        Chat.sendText = value => {
            if (!value) {
                return;
            }
            //取得現在時間
            let date = new Date();
            //自定義時間格式:Hour-Minute
            let formattedTime =
                date.getHours() +
                ":" +
                (date.getMinutes() < 10 ? "0" : "") +
                date.getMinutes();
            let record = {
                name: Meeting.props.userName, //0903 Andy Add a Temp
                userID: Meeting.localUserID,
                animal: Meeting.props.animalName,
                sendTime: formattedTime,
                text: value
            };
            //傳給別人的
            for (let id in msgChannels) {
                msgChannels[id].send(JSON.stringify(record));
            }
            //加到自己畫面上的
            Meeting.props.dispatch(addChatRecord(record));
        };
        return Chat;
    }
};

module.exports = Chat;
