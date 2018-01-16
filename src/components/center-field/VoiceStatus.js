"use strict";

import React from "react";
import { connect } from "react-redux";
import { setLanguage } from "../../actions/Actions";

class VoiceStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSetting: false,
            language: "cmn-Hant-TW",
            isChangeLanguage: false,
        };
        this.onClick_ToggleSetting = this.onClick_ToggleSetting.bind(this);
    }

    componentWillMount() { }

    componentDidMount() { }

    onClick_ToggleSetting() {
        this.setState({
            isSetting: !this.state.isSetting
        });
    }

    onClick_setLanguage() {
        this.onClick_ToggleSetting()
        this.props.Recognizer.setLanguage(this.state.language)
        //this.props.dispatch(setLanguage(this.state.language));
    }

    handleChangeLanguage(e) {
        this.setState({
            language: e.target.value
        });
    }

    render() {
        return (
            <div className="voice-content" onClick={this.state.isSetting ? "" : this.onClick_ToggleSetting}>
                <div className="voice-ai">
                    <div className="rect1" />
                    <div className="rect2" />
                    <div className="rect3" />
                    <div className="rect4" />
                    <div className="rect5" />
                </div>
                <label className="voice-text">語音辨識中...</label>

                {this.state.isSetting ? (
                    <div className="voice-type">
                        語言：
                        <form>
                            <select
                                className="VoiceInput"
                                name="language"
                                value={this.state.language}
                                onChange={e => {
                                    this.handleChangeLanguage(e);
                                }}
                            >
                                <option value="cmn-Hant-TW">中文</option>
                                <option value="en-US">英文</option>
                            </select>
                        </form>
                        <div className="Voice-img">
                            <img
                                className="voice-arrow"
                                src="./img/arrow_white.png"
                                onClick={() => { this.onClick_setLanguage() }}
                            />
                        </div>
                    </div>
                ) :
                    <div className="hover-content" >↑點此換語言</div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.chatAndRecognition.language
    };
};

export default connect(mapStateToProps)(VoiceStatus);
