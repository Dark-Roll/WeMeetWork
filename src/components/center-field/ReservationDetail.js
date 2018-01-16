"use strict";

import React from "react";
import { connect } from "react-redux";
import socket from "../../socket";
import ReservationResult from "./ReservationResult";
import {
    setReceiveData,
    setURL
} from "../../actions/Actions";

class ReservationDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            site: "",
            title: "",
            note: ""
        };
        this.OnClick_EmitMeeting = this.OnClick_EmitMeeting.bind(this);
        this.date = ""
    }

    componentWillMount() { }

    componentDidMount() {
        laydate.render({
            elem: document.getElementById("datetime"),
            type: "datetime",
            theme: "#cb253e",
            format: "yyyy年MM月dd日 HH時mm分",
            min: 0,
            max: 120,
            done: function (value, date, endDate) {
                let element = document.getElementById("date");
                let inputdate =
                    date.year.toString().padLeft(2, "0") +
                    date.month.toString().padLeft(2, "0") +
                    date.date.toString().padLeft(2, "0") +
                    "T" +
                    date.hours.toString().padLeft(2, "0") +
                    date.minutes.toString().padLeft(2, "0") +
                    date.seconds.toString().padLeft(2, "0");
                element.value = inputdate
            }
        });
    }

    componentWillUnmount() { }

    OnChange_site(e) {
        this.setState({
            site: e.target.value
        }, () => {
            this.OnChange_reservation()
        })
    }

    OnChange_title(e) {
        this.setState({
            title: e.target.value
        }, () => {
            this.OnChange_reservation()
        })
    }

    OnChange_note(e) {
        this.setState({
            note: e.target.value
        }, () => {
            this.OnChange_reservation()
        })
    }

    OnChange_reservation() {
        let hash = window.location.hash.substring(1)
        // let Hash = Math.floor((1 + Math.random()) * 1e16)
        //     .toString(16)
        //     .substring(8);
        let URL = "https://140.123.175.95:8080/meeting?hash=" + hash;
        let new_href =
            "https://www.google.com/calendar/render?action=TEMPLATE&trp=true&sf=true&output=xml" +
            "&dates=" +
            this.refs.date.value +
            "/" +
            this.refs.date.value +
            "&details=" +
            this.state.note +
            "%0A" +
            URL +
            "&location=" +
            this.state.site +
            "&text=" +
            this.state.title;
        this.props.dispatch(setURL(new_href));
    }

    OnClick_EmitMeeting() {
        socket.emit("reserveMeeting", {
            href: this.props.url,
            datetime: this.refs.datetime.value,
            location: this.refs.site.value,
            title: this.refs.title.value,
            note: this.refs.note.value
        });
        this.props.dispatch(setReceiveData(false));
        this.props.closeReservation();
    }

    render() {
        return (
            <div className="reservation-detail" id="Fadein">
                <div className="input-field bigtitle">預約開會</div>
                <div className="input-field">
                    <span>
                        <img className="img" src="./img/calendar.png" />
                    </span>
                    <span className="title">開會日期</span>
                    <input
                        className="content"
                        id="datetime"
                        ref="datetime"
                        placeholder="點選選擇開會日期"
                    />
                    <input type="hidden" id="date" ref="date" />
                </div>
                <div className="input-field">
                    <span>
                        <img className="img" src="./img/location.png" />
                    </span>
                    <span className="title">開會地點</span>
                    <input
                        className="content"
                        ref="site"
                        onChange={(e) => { this.OnChange_site(e) }}
                        placeholder="例如：線上開會、會議室等"
                    />
                </div>
                <div className="input-field">
                    <span>
                        <img className="img" src="./img/aim.png" />
                    </span>
                    <span className="title">開會主題</span>
                    <input
                        className="content"
                        ref="title"
                        onChange={(e) => { this.OnChange_title(e) }}
                        placeholder="例如：討論新企劃、例行會議等"
                    />
                </div>
                <div className="input-field">
                    <span>
                        <img className="img" src="./img/note.png" />
                    </span>
                    <span className="title">備註</span>
                    <input
                        className="content"
                        ref="note"
                        onChange={(e) => { this.OnChange_note(e) }}
                        placeholder="請輸入議程或備忘錄"
                    />
                </div>
                <a href={this.props.url} target="_blank">
                    <div className="submit" onClick={this.OnClick_EmitMeeting}>
                        預約
                    </div>
                </a>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isReceivedData: state.reservation.isReceivedData,
        url: state.reservation.url
    };
};

export default connect(mapStateToProps)(ReservationDetail);
