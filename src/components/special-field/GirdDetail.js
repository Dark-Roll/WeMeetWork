"use strict";

import React from "react";
import { connect } from "react-redux";
import socket from '../../socket'
import { 
    setGridDetailClose,
    setGridOpen,
    setGridStart,
    setSixhatClose
} from "../../actions/Actions";

class GirdDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hadBeenPlayed: false,
            Whichpage: "startPage"
        };
        this.onClick_ToggleNextPage = this.onClick_ToggleNextPage.bind(this);
        this.onClick_TogglePreviousPage = this.onClick_TogglePreviousPage.bind(this);
    }

    componentWillMount() { }

    componentDidMount() { }

    onClick_exit() {
        this.props.dispatch(setGridDetailClose());
    }
    onClick_start() {
        this.props.dispatch(setSixhatClose())
        this.props.dispatch(setGridDetailClose());
        this.props.dispatch(setGridStart());
        this.props.dispatch(setGridOpen());
        socket.emit('setGridStart');
    }

    onClick_ToggleNextPage() {
        this.setState({
            Whichpage: "teachingPage"
        });
    }

    onClick_TogglePreviousPage() {
        this.setState({
            Whichpage: "startPage"
        });
    }

    render() {
        let GridPage;
        switch (this.state.Whichpage) {
            case "teachingPage":
                GridPage = (
                    <div className="teachingPage">
                        <div className="title">
                            <div className="logo" id="grid" />
                            <div className="line" />
                            <label className="text">遊戲教學</label>
                        </div>
                        <div
                            className="exit"
                            onClick={() => {
                                this.onClick_exit();
                            }}
                        />
                        <div className="teachingText" id="grid">
                            <ul>
                                <li id="fadeIn">
                                    分析問題範例：將要發想的問題填在中央，再向八個方向發想不同面向的問題，以利全方面的思考。
                                </li>
                            </ul>
                        </div>
                        <div className="teachingSixhat">
                            <img
                                className="teachingImg1"
                                id="fadeIn2"
                                src="./img/grid_teachingpag1.png"
                            />
                        </div>
                        <div className="bottom-field">
                            <div
                                className="button"
                                onClick={() => {
                                    this.onClick_start();
                                }}
                            >
                                開始遊戲
                            </div>
                            <div
                                className="button"
                                onClick={this.onClick_TogglePreviousPage}
                            >
                                回上一頁
                            </div>
                        </div>
                    </div>

                );
                break;
            case "startPage":
                GridPage = (
                    <div className="startPage">
                        <div className="title">
                            <div className="logo" id="grid" />
                            <div className="line" />
                            <label className="text">九宮格分析法</label>
                        </div>
                        <div
                            className="exit"
                            onClick={() => {
                                this.onClick_exit();
                            }}
                        />
                        <div className="left-field">
                            <img className="img" src="./img/grid_img.png" />
                            <div className="text">
                                遊戲簡介：將想發想的主題寫在中央，然後向八個方向去思考，加深加廣思考範圍，讓思考更有條理和效率。
                            </div>
                        </div>
                        <div className="right-field">
                            <div className="instruction">
                                <label className="type">時機</label>
                                <div className="line" />
                                <ul className="list">
                                    <li>團隊沒有太多的想法</li>
                                    <li>想加深加廣思考範圍</li>
                                </ul>
                            </div>
                            <div className="instruction">
                                <label className="type">應用範圍</label>
                                <div className="line" />
                                <ul className="list">
                                    <li>分析問題</li>
                                    <li>擬訂計畫</li>
                                    <li>創意發想</li>
                                </ul>
                            </div>
                        </div>
                        <div className="bottom-field">
                            <div className="button" onClick={() => { this.onClick_start(); }}>開始遊戲</div>
                            <div className="button" onClick={this.onClick_ToggleNextPage}>觀看教學</div>
                        </div>
                    </div>
                )

                break;

            default:
                break;
        }
        return (
            <div className="brainstorming-field">
                {GridPage}
            </div>
        );
    }
}

export default connect()(GirdDetail);
