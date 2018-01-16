"use strict";
// {   投票資料格式
//     secretOrNot:1, 0:記名 1:匿名
//     question:"sssssss",
//     option:["ssss","xxxxx","pppppp"],
//     multiOrNot:[1(0:一票 1:多票),3(多票是幾票)],
// }
import React from "react";
import { connect } from "react-redux";
import socket from "../../socket";

class VoteDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegisteredSelect: true,
            isMultivoteOpen: false,
            isVoteReady: false,
            MultivoteNumber: 2,
            voting: {
                creator: this.props.userName || this.props.animalName || "使用者"+this.props.localUserID.substring(0,4),
                secretOrNot: 0,
                multiOrNot: [0],
                question: "",
                option: {
                    option1: "",
                    option2: ""
                },
                restart:false
            },
            alertMessage:"",
            showAlertMessage:'none'
        };
        this.onClick_ToggleMultivote = this.onClick_ToggleMultivote.bind(this);
        this.onClick_Subtractuon = this.onClick_Subtractuon.bind(this);
        this.onClick_Addition = this.onClick_Addition.bind(this);
    }

    componentWillMount() {}

    componentDidMount() {}

    onClick_Registered() {
        if (this.state.isRegisteredSelect) {
            return;
        } else {
            this.setState({
                isRegisteredSelect: !this.state.isRegisteredSelect,
                voting: {
                    ...this.state.voting,
                    secretOrNot: 0
                }
            });
        }
    }

    onClick_Anonymous() {
        if (!this.state.isRegisteredSelect) {
            return;
        } else {
            this.setState({
                isRegisteredSelect: !this.state.isRegisteredSelect,
                voting: {
                    ...this.state.voting,
                    secretOrNot: 1
                }
            });
        }
    }

    onChangeQuestion(e) {
        let counter = 0;
        let flag = true;
        Object.keys(this.state.voting.option).map(key => {
            if (this.state.voting.option[key]) {
                counter += 1;
            } else {
                flag = false;
            }
        });
        if (!e.target.value) {
            console.log("沒打東C喔QQ，提醒一波");
            this.setState({
                voting:{
                    ...this.state.voting,
                    question: e.target.value
                },
                isVoteReady: false
            },()=>{
                this.checkValue()
            });
        } else {
            this.setState({
                isVoteReady: counter >= 2 && flag ? true : false,
                voting: {
                    ...this.state.voting,
                    question: e.target.value
                }
            },()=>{
                this.checkValue()
            });
        }
    }

    onBlurQuestion(e) {
        let counter = 0;
        let flag = true;
        Object.keys(this.state.voting.option).map(key => {
            if (this.state.voting.option[key]) {
                counter += 1;
            } else {
                flag = false;
            }
        });
        if (!e.target.value) {
            console.log("沒打東C喔QQ，提醒一波");
            this.setState({
                voting:{
                    ...this.state.voting,
                    question: e.target.value
                },
                isVoteReady: false
            },()=>{
                this.checkValue()
            });
        } else {
            this.setState({
                isVoteReady: counter >= 2 && flag ? true : false,
                voting: {
                    ...this.state.voting,
                    question: e.target.value
                }
            },()=>{
                this.checkValue()
            });
        }
    }

    onEnterQuestion(e) {
        if (e.keyCode == 13) {
            e.target.blur();
        }
    }

    onChangeOption(e) {
        if (e.target.value) {
            this.setState(
                {
                    voting: {
                        ...this.state.voting,
                        option: {
                            ...this.state.voting.option,
                            [e.target.id]: e.target.value
                        }
                    }
                },
                () => {
                    let plusCounter = 0;
                    let minusCounter = 0;
                    Object.keys(this.state.voting.option).map(key => {
                        if (this.state.voting.option[key]) {
                            plusCounter += 1;
                        } else {
                            minusCounter += 1;
                        }
                    });
                    this.setState({
                        isVoteReady:
                            plusCounter >= 2 && minusCounter == 0 ? true : false
                    },()=>{
                        this.checkValue()
                    });
                }
            );
        } else {
            console.log("沒值阿!給個紅框");
            this.setState({
                isVoteReady: false,
                voting: {
                    ...this.state.voting,
                    option: {
                        ...this.state.voting.option,
                        [e.target.id]: e.target.value
                    }
                }
            },()=>{
                this.checkValue()
            });
        }
    }

    onBlurOption(e) {
        if (e.target.value) {
            this.setState(
                {
                    voting: {
                        ...this.state.voting,
                        option: {
                            ...this.state.voting.option,
                            [e.target.id]: e.target.value
                        }
                    }
                },
                () => {
                    let plusCounter = 0;
                    let minusCounter = 0;
                    Object.keys(this.state.voting.option).map(key => {
                        if (this.state.voting.option[key]) {
                            plusCounter += 1;
                        } else {
                            minusCounter += 1;
                        }
                    });
                    this.setState({
                        isVoteReady:
                            plusCounter >= 2 && minusCounter == 0 ? true : false
                    },()=>{
                        this.checkValue()
                    });
                }
            );
        } else {
            console.log("沒值阿!給個紅框");
            this.setState({
                isVoteReady: false,
                voting: {
                    ...this.state.voting,
                    option: {
                        ...this.state.voting.option,
                        [e.target.id]: e.target.value
                    }
                }
            });
        }
    }

    onEnterOption(e) {
        if (e.keyCode == 13) {
            e.target.blur();
        }
    }

    onClick_ToggleMultivote() {
        //如果原本是多票>改成單票
        if (this.state.isMultivoteOpen) {
            this.setState({
                isMultivoteOpen: !this.state.isMultivoteOpen,
                voting: {
                    ...this.state.voting,
                    multiOrNot: [0]
                }
            });
        } else {
            this.setState({
                isMultivoteOpen: !this.state.isMultivoteOpen,
                voting: {
                    ...this.state.voting,
                    multiOrNot: [1, this.state.MultivoteNumber]
                }
            });
        }
    }

    onClick_Subtractuon() {
        if (this.state.MultivoteNumber > 2) {
            this.setState({
                MultivoteNumber: this.state.MultivoteNumber - 1,
                voting: {
                    ...this.state.voting,
                    multiOrNot: [1, this.state.MultivoteNumber - 1]
                }
            });
        }
    }

    onClick_Addition() {
        if (this.state.MultivoteNumber < 10) {
            this.setState({
                MultivoteNumber: this.state.MultivoteNumber + 1,
                voting: {
                    ...this.state.voting,
                    multiOrNot: [1, this.state.MultivoteNumber + 1]
                }
            });
        }
    }

    onClick_deleteOption(e) {
        //刪除那個選項
        let delOption = Object.keys(
            this.state.voting.option
        ).reduce((newOption, key) => {
            if (key !== e.target.id) {
                newOption[key] = this.state.voting.option[key];
            }
            return newOption;
        }, {});

        let newOptionOrder = {};

        Object.keys(delOption).map((optionKey, index) => {
            newOptionOrder["option" + (index + 1)] = delOption[optionKey];
        });

        let counter = 0;
        let flag = true;

        Object.keys(newOptionOrder).map(key => {
            if (!newOptionOrder[key]) {
                flag = false;
            } else {
                counter += 1;
            }
        });

        this.setState({
            isVoteReady: counter >= 2 && flag ? true : false,
            voting: {
                ...this.state.voting,
                option: newOptionOrder
            }
        });
    }

    onClick_newOption(e) {
        let key = "option" + (Object.keys(this.state.voting.option).length + 1);
        this.setState(
            {
                isVoteReady: false,
                voting: {
                    ...this.state.voting,
                    option: {
                        ...this.state.voting.option,
                        ["option" +
                        (Object.keys(this.state.voting.option).length + 1)]: ""
                    }
                }
            },
            () => {
                this.refs[key].focus();
                this.checkValue()
            }
        );
    }

    onClick_startVoing() {
        if(this.state.isVoteReady){
            let date = new Date();
            //自定義時間格式:Hour-Minute
            let formattedTime = `${date.getHours()}:${(date.getMinutes() < 10 ? "0" : "")}${date.getMinutes()}:${date.getSeconds()}`
            this.setState({
                showAlertMessage:'none'
            })
                if(this.props.isVotingStart){
                let r = confirm("要建立新的投票嗎?");
                if(r = true){
                    console.log("發送投票資訊到伺服器>全部人同步");
                    this.setState({
                        voting:{
                            ...this.state.voting,
                            restart:true
                        }
                    },()=>{
                       socket.emit("createVote", this.state.voting, formattedTime); 
                    })  
                }
            } else {
                console.log("發送投票資訊到伺服器>全部人同步");
                socket.emit("createVote", this.state.voting, formattedTime);
            }
        } else {
            this.checkValue()
        }
    }

    checkValue(){
        if(!this.state.isVoteReady){
            this.setState({
                showAlertMessage:'block'
            })
            if(!this.state.voting.question){
                this.setState({
                    alertMessage:"主題是空的"
                })
                return
            } 
            if(Object.values(this.state.voting.option).includes("")){
                this.setState({
                    alertMessage:"有空的選項"
                })
                return
            } 
            if(Object.keys(this.state.voting.option).length < 2){
                this.setState({
                    alertMessage:"至少要兩個選項"
                })
                return
            }
        } else {
            this.setState({
                showAlertMessage:'none'
            })
        }
    }

    render() {
        let option = [];
        for (let key in this.state.voting.option) {
            option.push(
                <div className="question">
                    <div
                        className="delete"
                        onClick={e => {
                            this.onClick_deleteOption(e);
                        }}
                        id={key}
                        ref={key}
                    />
                    <input
                        value={this.state.voting.option[key]}
                        className="text"
                        type="text"
                        id={key}
                        ref={key}
                        placeholder="請輸入投票選項"
                        onBlur={e => {
                            this.onBlurOption(e);
                        }}
                        onChange={e => {
                            this.onChangeOption(e);
                        }}
                        onKeyUp={e => {
                            this.onEnterOption(e);
                        }}
                    />
                    <span className="focus-bg" />
                </div>
            );
            this.refs.key = this.state.voting.option[key];
        }

        return (
            <div className="voting" id="Fadein">
                <div className="votetypeselect">
                    <button
                        className="registered"
                        id={
                            this.state.isRegisteredSelect
                                ? "selected"
                                : "notselected"
                        }
                        onClick={() => {
                            this.onClick_Registered();
                        }}
                    >
                        記名投票
                    </button>

                    <button
                        className="anonymous"
                        id={
                            this.state.isRegisteredSelect
                                ? "notselected"
                                : "selected"
                        }
                        onClick={() => {
                            this.onClick_Anonymous();
                        }}
                    >
                        匿名投票
                    </button>
                </div>

                <div className="votequestion">
                    <input
                        className="input"
                        ref="votequestion"
                        type="text"
                        placeholder="請輸入投票主題"
                        onChange={e => {
                            this.onChangeQuestion(e);
                        }}
                        onBlur={e => {
                            this.onChangeQuestion(e);
                        }}
                        onKeyUp={e => {
                            this.onEnterQuestion(e);
                        }}
                    />
                    <span className="focus-border" />
                </div>

                <div className="voteconent">
                    {option}
                    <div
                        className="question"
                        onClick={e => {
                            this.onClick_newOption(e);
                        }}
                    >
                        <div className="add" />
                        <div className="text">按此新增選項</div>
                    </div>
                </div>

                <div className="votebottom">
                    <div className="multi-vote">複選</div>
                    <input
                        className="toggle"
                        type="checkbox"
                        name="check-3"
                        onClick={this.onClick_ToggleMultivote}
                    />
                    <div
                        className="multivote-number"
                        id={this.state.isMultivoteOpen ? "visible" : "hidden"}
                    >
                        <button
                            className="subtraction"
                            onClick={this.onClick_Subtractuon}
                        >
                            -
                        </button>
                        <input
                            className="number"
                            type="text"
                            value={this.state.MultivoteNumber}
                        />
                        <button
                            className="addition"
                            onClick={this.onClick_Addition}
                        >
                            +
                        </button>
                    </div>
                    <span className="votestatus" style={{display:this.state.showAlertMessage}}>{this.state.alertMessage}</span>
                    <button
                        className="votesubmit"
                        id={this.props.isVotingStart? "restartVote" : (this.state.showAlertMessage == 'block' ? 'close':'open')}
                        onClick={e => {
                            this.onClick_startVoing(e);
                        }}
                    >{this.props.isVotingStart? "發起新投票":"開始投票"}
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        userName: state.connection.userName,
        animalName: state.connection.animalName,
        localUserID: state.connection.localUserID,
        isVotingStart: state.vote.isVotingStart
    };
};

export default connect(mapStateToProps)(VoteDetail);
