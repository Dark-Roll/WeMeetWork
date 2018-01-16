"use strict";

import React from "react";
import { connect } from "react-redux";

class Chatroom extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() { }

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
        let chatbox = [];
        if (this.props.chatRecord) {
            this.props.chatRecord.map(record => {
                if (record.userID == this.props.localUserID) {
                    let localAnimalNum = 0;
                    let localAnimal = "";
                    this.props.participantList.map((obj)=>{
                        if(obj.id == this.props.localUserID){
                            localAnimalNum = obj.num
                            localAnimal = obj.animal
                        }
                    })
                    chatbox.push(
                        <div className="myself-message">
                            <div className="myself-infro">
                                <img className="image" src={"./img/animal" + record.animal + ".jpg"} />
                                <div className="name">
                                    {record.name}
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
                    let remoteAnimalNum = 0;
                    let remoteAnimal = "";
                    this.props.participantList.map((obj)=>{
                        if(record.userID == obj.id){
                            remoteAnimalNum = obj.num
                            remoteAnimal = obj.animal
                        }
                    })
                    chatbox.push(
                        <div className="others-message">
                            <div className="others-infro">
                                <img className="image" src={"./img/animal" + record.animal + ".jpg"} />
                                <div className="name">
                                    {   this.props.participantList.includes(record.userID) ? 
                                        (this.props.remoteUserName[record.userID] &&
                                        this.props.remoteUserName[record.userID] !== record.userID
                                        ?
                                        this.props.remoteUserName[record.userID]
                                        :
                                        remoteAnimal) : record.name
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

        /*** FOR TEST ***/
        let test = [];
        let text = "測測試測試測試";
        // for (let i = 0; i <= 3; i++) {
        //     const type = false;
        //     text += text;
        //     if (type) {
        //         test.push(
        //             <div className="myself-message">
        //                 <div className="myself-infro">
        //                     <img className="image" src="./img/animal1.jpg" />
        //                     <div className="name">李佳怡</div>
        //                 </div>
        //                 <div className="dialogbox">{text}</div>
        //                 <div className="time">11:59</div>
        //             </div>
        //         );
        //     } else {
        //         test.push(
        //             <div className="others-message">
        //                 <div className="others-infro">
        //                     <img className="image" src="./img/animal2.jpg" />
        //                     <div className="name">李佳怡</div>
        //                 </div>

        //                 <div className="dialogbox">{text}</div>
        //                 <div className="time">11:59</div>
        //             </div>
        //         );
        //     }
        // }

        return (
            <div className="leftchatbox">
                {chatbox}
                {test}
                <div
                    style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        localUserName: state.connection.userName,
        localUserID: state.connection.localUserID,
        remoteUserName: state.connection.remoteUserName,
        chatRecord: state.chat,
        participantList: state.participantList
    };
};

export default connect(mapStateToProps)(Chatroom);
