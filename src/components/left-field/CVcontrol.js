"use strict";

import React from "react";
import { connect } from "react-redux";
import { changeToAnotherChannel } from "../../actions/Actions";

class CVcontrol extends React.Component {
    constructor(props) {
        super(props);
        this.onClick_Chatroom = this.onClick_Chatroom.bind(this);
        this.onClick_VoiceRecognition = this.onClick_VoiceRecognition.bind(this);
    }

    componentWillMount() {}

    componentDidMount() {}

    onClick_Chatroom() {
        if (this.props.isInChatNow) {
            return;
        } else {
            this.props.dispatch(changeToAnotherChannel());
        }
    }

    onClick_VoiceRecognition() {
        if (this.props.isInChatNow) {
            this.props.dispatch(changeToAnotherChannel());
        }
    }

    render() {
        return (
            <div className="CVcontrol">
                <div
                    className="chatroom"
                    id={this.props.isInChatNow ? "selected" : "no-selected"}
                    onClick={this.onClick_Chatroom}
                >
                    {" "}
                    聊天室
                </div>

                <div
                    className="voice-recognition"
                    id={this.props.isInChatNow ? "no-selected" : "selected"}
                    onClick={this.onClick_VoiceRecognition}
                >
                    {" "}
                    語音辨識
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isInChatNow: state.chatAndRecognition.isInChatNow
    };
};
export default connect(mapStateToProps)(CVcontrol);
