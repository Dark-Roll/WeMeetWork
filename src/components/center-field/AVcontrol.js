"use strict";

import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {
    toggleAudio,
    toggleUserMedia,
    delRemoteStreamURL,
    gotLocalVideo,
    addRemoteStreamURL
} from "../../actions/Actions";
import socket from "../../socket";

class AVcontrol extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // isShowExitConfirm: false 是否顯示離開房間的警示框
            isShareScreenStart: false
        };
        this.onClick_toggleAudioControl = this.onClick_toggleAudioControl.bind(
            this
        );
        this.onClick_toggleVideoControl = this.onClick_toggleVideoControl.bind(
            this
        );
        this.onClick_startShare = this.onClick_startShare.bind(this);

        // this.onClick_ShowConfirm = this.onClick_ShowConfirm.bind(this);
    }

    componentWillMount() { }

    componentDidMount() {
        // window.screenSharingObject = new Screen(this.props.localUserID);; // argument is optional
        // // on getting local or remote streams
        // window.screenSharingObject.onaddstream = function(e) {
        //     console.log('收到別人的影像了!')
        //     document.body.appendChild(e.video);
        // };
    }

    //Button Events
    onClick_toggleAudioControl() {
        this.props.Chat.toggleAudio();
        socket.emit(
            "setRemoteAudioState",
            !this.props.isSounding,
            this.props.localUserID
        );
        this.props.dispatch(toggleAudio());
    }

    onClick_toggleVideoControl() {
        this.props.Chat.toggleUserMedia();
        socket.emit(
            "setRemoteVideoState",
            !this.props.isStreaming,
            this.props.localUserID
        );
        this.props.dispatch(toggleUserMedia());
    }

    onClick_showRecord() {
        this.props.history.push("/record" + this.props.roomName.substring(37));
    }

    onClick_startShare() {

        let thisComponent = this;
        if (window.shareScreen && Object.keys(window.shareScreen).length > 0) {
            //可以直接撥打
        } else {
            //先取得UserMedia
            let screen_constraints = {
                mandatory: {
                    chromeMediaSource: "screen",
                    maxWidth: 1920,
                    maxHeight: 1080,
                    minAspectRatio: 1.77
                },
                optional: []
            };
            getScreenId(function (error, sourceId, screen_constraints) {
                navigator.getUserMedia =
                    navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
                navigator.getUserMedia(
                    screen_constraints,
                    function (stream) {
                        window.shareScreenStream = stream;
                        window.shareScreenStream.oninactive = () => {
                            socket.emit("closeShareScreen");
                            thisComponent.props.dispatch(
                                gotLocalVideo(
                                    URL.createObjectURL(window.localStream),
                                    false
                                )
                            );
                        };
                        console.log("收到stream了", stream);
                        thisComponent.props.dispatch(
                            gotLocalVideo(
                                URL.createObjectURL(window.shareScreenStream),
                                true
                            )
                        );
                        //開始撥打
                        //window.Peer.destroy()
                        let UUID = Date.now();
                        let peer = new window.peerConstructor(
                            thisComponent.props.localUserID + UUID,
                            {
                                host: "140.123.175.95",
                                port: 443,
                                path: "/peerjs",
                                config:
                                thisComponent.props.Meeting.configuration
                            }
                        );
                        window.sharePeer = peer;

                        window.sharePeer.on("call", call => {
                            // window.Peer.destroy()
                            call.answer(window.shareScreenStream);
                            call.on("stream", remoteStream => {
                                console.log("收到影像啦!" + stream);
                                let url = URL.createObjectURL(remoteStream);
                                thisComponent.props.dispatch(
                                    addRemoteStreamURL({
                                        remotePeer: call.peer,
                                        url: url
                                    })
                                );
                            });
                        });
                        socket.emit("shareScreenInvoke", UUID);
                        thisComponent.setState({
                            isShareScreenStart: true
                        });
                    },
                    function (error) {
                        console.error("getScreenId error", error);
                        // alert(
                        //     "Failed to capture your screen. Please check Chrome console logs for further information."
                        // );
                    }
                );
            });
        }
    }

    render() {
        return (
            <div className="av-control">
                <div
                    className="av-button"
                    id={this.props.isSounding ? "audio-on" : "audio-off"}
                    onClick={this.onClick_toggleAudioControl}
                >
                    <div
                        className="hovertext"
                        id={this.props.isSounding ? "audio-on" : "audio-off"}
                    >
                        {this.props.isSounding ? "靜音" : "取消靜音"}
                    </div>
                </div>

                <div
                    className="av-button"
                    id="exit"
                    onClick={() => {
                        this.onClick_showRecord();
                    }}
                >
                    <div className="hovertext" id="exit">
                        結束會議
                    </div>
                </div>

                <div
                    className="av-button"
                    id={this.props.isStreaming ? "video-on" : "video-off"}
                    onClick={this.onClick_toggleVideoControl}
                >
                    <div
                        className="hovertext"
                        id={this.props.isStreaming ? "video-on" : "video-off"}
                    >
                        {this.props.isStreaming ? "開啟視訊" : "取消視訊"}
                    </div>
                </div>

                <div
                    className="sharescreen"
                    id={this.state.isShareScreenStart ? "active" : "no-active"}
                    onClick={this.onClick_startShare}
                >
                    <label
                        className="sharetext"
                        id={this.state.isShareScreenStart ? "active" : ""}
                    >
                        {this.state.isShareScreenStart ? "取消共享" : "共享螢幕"}
                    </label>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        localUserID: state.connection.localUserID,
        roomName: state.connection.roomName,
        isStreaming: state.connection.isStreaming,
        isSounding: state.connection.isSounding
    };
};

export default withRouter(connect(mapStateToProps)(AVcontrol));
