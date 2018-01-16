"use strict";

import React from "react";
import {connect} from "react-redux"
import socket from "../../socket"
import {
    addChatRecord,
    addRecognitionRecord
} from "../../actions/Actions"

class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatInputValue: ""
        };
        this.animalName = {
            1: "貓貓",
            2: "狗狗",
            3: "猩猩",
            4: "獅子",
            5: "無尾熊",
            6: "兔兔",
            7: "老虎",
            8: "狐狸"
        };
        this.handleInputPressClick = this.handleInputPressClick.bind(this); 
    }

    componentWillMount() { }

    componentDidMount() { }

    handleInputPressEnter(e) {
        if (e.which == 13) {
            //按下enter後
            e.preventDefault();
            this.handleInputPressClick();
        }
    }

    handleInputPressClick() {
        if(this.state.chatInputValue){
            //取得現在時間
            let date = new Date();
            //自定義時間格式:Hour-Minute
            let formattedTime = `${date.getHours()}:${(date.getMinutes() < 10 ? "0" : "")}${date.getMinutes()}`
            let animal = Number(Object.values(this.animalName).indexOf(this.props.animalName))+1
            let record = {
                name: this.props.userName, //0903 Andy Add a Temp
                userID: this.props.localUserID,
                animal: animal,
                sendTime: formattedTime,
                text: this.state.chatInputValue
            };
            socket.emit("chatMessage",record)
            //加到自己畫面上的
            this.props.dispatch(addChatRecord(record));
            this.setState({
                chatInputValue: ""
            })
        }
        
    }

    handleInputOnChange(e) {
        this.setState({
            chatInputValue: e.target.value
        });
    }

    render() {
        return (
            <div className="left-input">
                <div className="input-filed">
                    <input
                        className="input-text"
                        ref="input_text"
                        type="text"
                        onKeyPress={e => {
                            this.handleInputPressEnter(e);
                        }}
                        onChange={e => {
                            this.handleInputOnChange(e);
                        }}
                        value={this.state.chatInputValue}
                    />
                    <button className="upload" onClick={this.handleInputPressClick} />
                </div>
                <img className="mailbox" src="./img/mailbox.png" />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userName: state.connection.userName,
        animalName: state.connection.animalName,
        localUserID: state.connection.localUserID
    };
};
export default connect(mapStateToProps)(ChatInput);
