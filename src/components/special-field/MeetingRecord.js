import React from "react";
import Background from "./Background";
import { connect } from "react-redux";

class MeetingRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.clear = true;
        this.wasPressed = false;
    }

    componentWillMount() { }

    componentDidMount() {
        window.document.addEventListener("keydown", e => {
            this.fkey(e);
        });
        // window.document.addEventListener('keypress',(e)=>{fkey(e)})
        // window.document.addEventListener('keyup',(e)=>{fkey(e)})

    }

    componentWillUnmount() {
        if (this.clear) {
            window.localStorage.clear();
            this.props.dispatch({ 'type': 'CLEAR' })
        }
    }

    fkey(e) {
        e = e || window.event;
        if (this.wasPressed) return;
        if (e.keyCode == 116) {
            this.clear = false;
            this.wasPressed = true;
        } else {
            this.clear = true;
        }
    }

    render() {
        let participant = `${this.props.localUserName}、${Object.values(this.props.remoteUserName).join('、')}`

        let agenda = []
        if (this.props.agendaList[0].content) {
            this.props.agendaList.map((agendaObj, index) => {
                let temp = `第 ${index + 1} 項議程－ ${agendaObj.content}`
                let temp2 = `\u00A0\u00A0建立時間： ${agendaObj.createTime || ''}`
                let temp3 = `完成時間： ${(agendaObj.isAgendaFinished ? `${agendaObj.finishTime}` : "未完成")}`
                agenda.push(
                    <li>
                        {temp}
                    </li>
                )
                agenda.push(
                    <li className="second-order">
                        {temp2} ／ {temp3}
                    </li>
                )
            })
        } else {
            agenda = "無"
        }

        let vote = []
        if (this.props.voteHistory) {
            this.props.voteHistory.map((voteObj, index) => {
                let temp1 = `第 ${index + 1}次投票／創建者：${voteObj.vote.creator}／時間:${voteObj.vote.createTime}`
                let temp4 = `提案事項－${voteObj.vote.question}`
                vote.push(<li>{temp1}</li>)
                vote.push(<li>{temp4}</li>)

                let voter = []
                let winner = []
                let max = 0
                let length = Object.keys(voteObj.vote.option).length
                for (let i = 1; i < length + 1; i++) {
                    let option = `\u00A0\u00A0\u00A0\u00A0項目 ${i} : ${voteObj.vote.option[`option${i}`]} ／票數: ${voteObj.result[`option${i}`] ? voteObj.result[`option${i}`].sum : '0'} ／同意人員: ${voteObj.result[`option${i}`] ? voteObj.result[`option${i}`].voter.join('、') : "無"}`
                    vote.push(<li className="second-order">{option}</li>)
                    if (voteObj.result[`option${i}`]) {
                        if (voteObj.result[`option${i}`].sum > max) {
                            max = voteObj.result[`option${i}`].sum
                            winner = [i]
                        } else if (voteObj.result[`option${i}`].sum == max) {
                            winner.push(i)
                        } else {
                            return
                        }
                    }
                }
                let temp5 = `\u00A0\u00A0\u00A0\u00A0決議: 採用提案項目: ${winner.join('、')}，時間: ${voteObj.finishTime}`
                let temp6 = `\u00A0\u00A0\u00A0\u00A0`
                vote.push(<li>{temp5}</li>)
            })
        } else {
            vote = '無'
        }


        let stringRecord = "";
        let recognitionRecord = [];
        let tempTime2 = ''
        if (this.props.recognitionRecord) {
            this.props.recognitionRecord.map(record => {
                let time = record.sendTime
                let temp = undefined
                if (time !== tempTime2) {
                    let timeMessage = `-----${time.substring(0, 2)}點${time.substring(3, 5)}分-----`
                    recognitionRecord.push(
                        <li>
                            {timeMessage}
                        </li>
                    );
                    tempTime2 = time;
                    stringRecord += (timeMessage + '\n');
                }
                temp = `${record.name} : ${record.text}`;
                recognitionRecord.push(
                    <li>
                        {temp}
                    </li>
                )
                stringRecord += (temp + '\n');
            });
        }

        let meetingRecord = []
        let tempTime = ''
        if (this.props.chatRecord) {
            this.props.chatRecord.map(record => {
                let time = record.sendTime
                let temp = undefined
                if (time !== tempTime) {
                    let timeMessage = `-----${time.substring(0, 2)}點${time.substring(3, 5)}分-----`
                    meetingRecord.push(
                        <li>
                            {timeMessage}
                        </li>
                    )
                    tempTime = time;
                    stringRecord += ('\n聊天室紀錄：\n' + timeMessage + '\n');
                }
                temp = `${record.name} : ${record.text}`
                meetingRecord.push(
                    <li>
                        {temp}
                    </li>
                )
                stringRecord += (temp + '\n');
            });
        }



        return (
            <div className="container">
                <div className="meetingrecord">
                    <div className="banner">
                        <a href="/">
                            <img className="logo" src="./img/index_logo2.png" />
                            <div className="backtoindex">回首頁</div>
                        </a>
                        <div className="edit left">修改前</div>
                        <div className="edit right">修改後</div>
                        <div className="title">
                            <div className="circle">會</div>
                            <div className="circle">議</div>
                            <div className="circle">紀</div>
                            <div className="circle">錄</div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="old-data">
                            <table className="meetingrecord-table">
                                <tbody className="meetingrecord-tbody">
                                    <tr>
                                        <td className="meetingrecord-title">會議日期</td>
                                        <td className="meetingrecord-content">2017/11/3</td>
                                    </tr>
                                    <tr >
                                        <td className="meetingrecord-title">與會人員</td>
                                        <td className="meetingrecord-content">{participant}</td>
                                    </tr>
                                    <tr>
                                        <td className="meetingrecord-title">會議長度</td>
                                        <td className="meetingrecord-content">{`${this.props.time[0]}小時${this.props.time[1]}分${this.props.time[2]}秒`}</td>
                                    </tr>
                                    <tr id="higher">
                                        <td className="meetingrecord-title" >會議議程</td>
                                        <td className="meetingrecord-content">
                                            <ol className="meetingrecord-textarea">
                                                {agenda}
                                            </ol>
                                        </td>
                                    </tr>
                                    <tr id="higher">
                                        <td className="meetingrecord-title" >提案事項</td>
                                        <td className="meetingrecord-content" >
                                            <div className="meetingrecord-textarea">
                                                {vote}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr id="record-detail">
                                        <td className="meetingrecord-title">語音紀錄</td>
                                        <td className="meetingrecord-content">
                                            <div className="meetingrecord-textarea">
                                                {recognitionRecord.length ? recognitionRecord : '無'}
                                                <br />聊天室紀錄：<br />{meetingRecord.length ? meetingRecord : '無'}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="new-data">
                            <table className="meetingrecord-table">
                                <tbody className="meetingrecord-tbody">
                                    <tr>
                                        <td className="meetingrecord-title">會議日期</td>
                                        <td className="meetingrecord-content">2017/11/3</td>
                                    </tr>
                                    <tr >
                                        <td className="meetingrecord-title">與會人員</td>
                                        <td className="meetingrecord-content">{participant}</td>
                                    </tr>
                                    <tr>
                                        <td className="meetingrecord-title">會議長度</td>
                                        <td className="meetingrecord-content">{`${this.props.time[0]}小時${this.props.time[1]}分${this.props.time[2]}秒`}</td>
                                    </tr>
                                    <tr id="higher">
                                        <td className="meetingrecord-title" >會議議程</td>
                                        <td className="meetingrecord-content">
                                            <ol className="meetingrecord-textarea">
                                                {agenda}
                                            </ol>
                                        </td>
                                    </tr>
                                    <tr id="higher">
                                        <td className="meetingrecord-title" >提案事項</td>
                                        <td className="meetingrecord-content" >
                                            <div className="meetingrecord-textarea">
                                                {vote}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr id="record-detail">
                                        <td className="meetingrecord-title" id="darken1">語音紀錄<br />(可以編輯內容)</td>
                                        <td className="meetingrecord-content" id="darken" >
                                            <textarea className="meetingrecord-textarea">
                                                {recognitionRecord.length ? stringRecord : '無'}
                                            </textarea>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div >
                <img className="ballon type1" src="./img/ballon.png" />
                <img className="ballon type2" src="./img/ballon.png" />
                <img className="ballon type3" src="./img/ballon.png" />
                <img className="ballon type4" src="./img/ballon.png" />
                <img className="ballon type5" src="./img/ballon.png" />
                <img className="ballon type6" src="./img/ballon.png" />
                <img className="moutain" src="./img/mountain.png" />
                <Background />
            </div >
        );
    }
}
const mapStateToProps = state => {
    return {
        localUserName: state.connection.userName,
        time: state.time,
        participantList: state.participantList,
        chatRecord: state.chat,
        recognitionRecord: state.chatAndRecognition.recognitionRecord,
        remoteUserName: state.connection.remoteUserName,
        agendaList: state.agenda,
        voteHistory: state.vote.history
    };
};
export default connect(mapStateToProps)(MeetingRecord);
