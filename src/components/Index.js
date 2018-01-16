import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import socket from "../socket";
import { setUserName} from "../actions/Actions";
// import { userGiveAdvice} from "../actions/Actions";
import Background from "./special-field/Background";
 
// socket.emit("id");
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            roomName: "",
            
        };
        this.onClick_handleCreateRoom = this.onClick_handleCreateRoom.bind(
            this
        );
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentWillMount() {
        document.addEventListener("keydown", this.onKeyDown);
        this.props.dispatch({ type: "CLEAR" });
        window.localStorage.clear();
        console.log(window.localStorage);
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown);
    }

    onKeyDown(e) {
        //console.log(document.activeElement);
        switch (e.keyCode) {
            case 13:
                if (!this.refs.roomName.value) {
                    this.refs.roomName.focus();
                    return;
                }
                if (!this.refs.userName.value) {
                    this.refs.userName.focus();
                    return;
                }
                if (this.state.userName && this.state.roomName) {
                    if (
                        document.activeElement == this.refs.roomName ||
                        document.activeElement == this.refs.userName
                    ) {
                        document.activeElement.blur();
                        return;
                    }
                    if (document.activeElement == document.body) {
                        // document.removeEventListener("keydown", this.onKeyDown);
                        this.onClick_handleCreateRoom();
                        return;
                    }
                }
                break;
            default:
                break;
        }
    }

    onChange_userName(e) {
        this.setState({ userName: e.target.value });
    }

    // onChange_userAdvice(e) {
    //     this.setState({ userAdvice: e.target.value });
    // }

    onChange_roomName(e) {
        this.setState({ roomName: e.target.value });
    }
    onClick_handleCreateRoom() {
        document.removeEventListener("keydown", this.onKeyDown);
        //按下建立房間後的事件
        this.props.dispatch(setUserName(this.state.userName));
        // this.props.dispatch(userGiveAdvice(this.state.userAdvice));
        // window.sessionStorage.setItem("userAdvice", this.state.userAdvice);
        window.sessionStorage.setItem("userName", this.state.userName);
        //做好名字之後>進到房間裡
        this.props.history.push("/meeting#" + this.state.roomName);
    }

    render() {
        return (
            <div className="container">
                <div className="index">
                    <img className="logo-top" src="./img/logo_top.png" />
                    <img className="logo-text" src="./img/logo_text.png" />
                    <img className="logo-bottom" src="./img/logo_bottom.png" />
                    <div className="indexName">
                        <div className="icon-field">
                            <img
                                className="icon-image"
                                src="./img/user-image.png"
                            />
                        </div>
                        <input
                            autoFocus={true}
                            ref="userName"
                            className="indexinput"
                            type="text"
                            placeholder="請輸入你的名字"
                            onChange={e => {
                                this.onChange_userName(e);
                            }}
                        />
                    <br />
                  

                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <div className="icon-field">
                            <img
                                className="icon-image"
                                src="./img/user-image.png"
                            />
                        </div>
                   

                        <br />


                    </div>
                  
                    <div className="indexMeeting">
                        <div className="icon-field">
                            <img
                                className="icon-image"
                                src="./img/meeting.png"
                            />
                        </div>
                        <input
                            ref="roomName"
                            className="indexinput"
                            type="text"
                            placeholder="請輸入房間名稱"
                            onChange={e => {
                                this.onChange_roomName(e);
                            }}
                        />
                    </div>
                    <div
                        className="addRoom"
                        onClick={() => {
                            this.onClick_handleCreateRoom();
                        }}
                    >
                        <img className="icon-image" src="./img/arrow.png" />
                    </div>


                </div>
                <Background />

                {/* <div class="indexName">
                
                        


                        <input value={this.state.userAdvice}
                            
                            ref="userAdvice"
                            className="indexinput"
                            type="text"
                            placeholder="請輸入你的意見"
                            onChange={e => {
                                this.onChange_userAdvice(e);
                            }}
                        />
                </div>          */}
            </div>
        );
    }
}

export default withRouter(connect()(Index));
