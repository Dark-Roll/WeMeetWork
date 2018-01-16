"use strict";

import React from "react";
import { connect } from "react-redux";

class VoiceRecognition extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        const node = this.messagesEnd;
        node.scrollIntoView({ behavior: "smooth" });
    }

    render() {
        let RecognitionRecord = [];
        if (this.props.recognitionRecord) {
            this.props.recognitionRecord.map(record => {
                if (record.userID == this.props.localUserID) {
                    RecognitionRecord.push(
                        <div className="myself-message">
                            <div className="myself-infro">
                                <img className="image" src="./img/animal1.jpg" />
                                <div className="name">
                                    {
                                        this.props.localUserName || 
                                        localAnimalName
                                    }
                                </div>
                            </div>
                            <div className="dialogbox">{record.text}</div>
                            <div className="time">{record.sendTime}</div>
                        </div>
                    );
                } else if (
                    record.userID &&
                    record.userID !== this.props.localUserID
                ) {
                    RecognitionRecord.push(
                        <div className="others-message">
                            <div className="others-infro">
                                <img className="image" src="./img/animal2.jpg" />
                                <div className="name">
                                    {
                                        this.props.remoteUserName[record.userID]
                                    }
                                </div>
                            </div>
                            <div className="dialogbox">{record.text}</div>
                            <div className="time">{record.sendTime}</div>
                        </div>
                    );
                }
            });
        }

        return (
            <div className="leftchatbox">
                {RecognitionRecord}
                <div
                    style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}
                />
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        localUserName: state.connection.userName,
        localAnimalName: state.connection.animalName,
        remoteUserName: state.connection.remoteUserName,
        localUserID: state.connection.localUserID,
        recognitionRecord: state.chatAndRecognition.recognitionRecord
    };
};

export default connect(mapStateToProps)(VoiceRecognition);
