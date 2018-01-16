"use strict";

import React from "react";
import {connect} from "react-redux"
import {setMeetingTime} from "../../actions/meetingAction"

class MeetingTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //會議時間，等到結束會議，要把這個資料送到會議紀錄
            Meetingtime: {
                hour: 0,
                min: 0,
                sec: 0
            }
        }
        this.StartMeetingTime = this.StartMeetingTime.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.recorder = setInterval(this.StartMeetingTime, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.recorder);
        this.props.dispatch(setMeetingTime(Object.values(this.state.Meetingtime)))
    }

    StartMeetingTime() {
        let meetingTime = this.state.Meetingtime;
        if (meetingTime.sec == 59) {
            meetingTime.sec = 1;
            meetingTime.min++;
        } else {
            meetingTime.sec++;
        }

        if (meetingTime.min == 59) {
            meetingTime.min = 1;
            meetingTime.hour++;
        }
        this.setState({
            Meetingtime: meetingTime
        });
    }

    render() {
        /* Andy: put meeting time record here */
        return (

            <div className="left-meetingtime">
                會議進行時間<br />
                {this.state.Meetingtime.hour}&nbsp;時&nbsp;
                {this.state.Meetingtime.min}&nbsp;分&nbsp;
                {this.state.Meetingtime.sec}&nbsp;秒&nbsp;
                </div>
        );
    }
}

export default connect()(MeetingTime);
