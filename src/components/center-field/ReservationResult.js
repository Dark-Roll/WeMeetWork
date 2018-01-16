"use strict";
import React from "react";
import { connect } from 'react-redux'
import socket from "../../socket";

class ReservationResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isResultDetailOpen: false
        }
        this.onClick_ToggleDetail = this.onClick_ToggleDetail.bind(this);
    }

    componentWillMount() { }

    componentDidMount() { }

    onClick_ToggleDetail() {
        this.setState({
            isResultDetailOpen: !this.state.isResultDetailOpen
        });
    }

    render() {
        return (
            <div>
                <div
                    className="ReceviedMeeting"
                    onClick={this.onClick_ToggleDetail}
                >
                    <img className="mail" src="./img/mail.png" />
                    <div className="content">一則預約開會通知！</div>
                </div>
                {this.state.isResultDetailOpen ? (
                    <div className="Recevied-Detail">
                        <div className="recevied-filed">
                            <span>
                                <img className="img" src="./img/calendar.png" />
                            </span>
                            <span className="title">
                                {this.props.meetingData.datetime}
                            </span>
                        </div>
                        <div className="recevied-filed">
                            <span>
                                <img className="img" src="./img/location.png" />
                            </span>
                            <span className="title">
                                {this.props.meetingData.location}
                            </span>
                        </div>
                        <div className="recevied-filed">
                            <span>
                                <img className="img" src="./img/aim.png" />
                            </span>
                            <span className="title">
                                {this.props.meetingData.title}
                            </span>
                        </div>
                        <a href={this.props.url} target="_blank">
                            <div className="add-button">加到Google日曆</div>
                        </a>
                    </div>
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isReceivedData: state.reservation.isReceivedData,
        meetingData: state.reservation.meetingData,
        url: state.reservation.url,
    };
};
export default connect(mapStateToProps)(ReservationResult);
