"use strict";

import React from "react";
import { connect } from "react-redux";
import { setGrid, setGridClose } from "../../actions/Actions";
import socket from "../../socket";
import { downloadCSV } from "../../lib/downloadCSV";

class GridGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEnlarge: false
        };
        this.onClick_ChangeSize = this.onClick_ChangeSize.bind(this);
        this.placeHolder = [
            [
                ["1-1", "1-2", "1-3"],
                ["1-4", "次中心", "1-6"],
                ["1-7", "1-8", "1-9"]
            ],
            [
                ["2-1", "2-2", "2-3"],
                ["2-4", "次中心", "2-6"],
                ["2-7", "2-8", "2-9"]
            ],
            [
                ["3-1", "3-2", "3-3"],
                ["3-4", "次中心", "3-6"],
                ["3-7", "3-8", "3-9"]
            ],
            [
                ["4-1", "4-2", "4-3"],
                ["4-4", "次中心", "4-6"],
                ["4-7", "4-8", "4-9"]
            ],
            [["1", "2", "3"], ["4", "中心", "6"], ["7", "8", "9"]],
            [
                ["5-1", "5-2", "5-3"],
                ["5-4", "次中心", "5-6"],
                ["5-7", "5-8", "5-9"]
            ],
            [
                ["6-1", "6-2", "6-3"],
                ["6-4", "次中心", "6-6"],
                ["6-7", "6-8", "6-9"]
            ],
            [
                ["7-1", "7-2", "7-3"],
                ["7-4", "次中心", "7-6"],
                ["7-7", "7-8", "7-9"]
            ],
            [
                ["8-1", "8-2", "8-3"],
                ["8-4", "次中心", "8-6"],
                ["8-7", "8-8", "8-9"]
            ]
        ];
    }

    componentWillMount() {}

    componentDidMount() {}

    onChangeInput(e) {
        let key = e.target.getAttribute("data");
        let a = parseInt(key.substring(5, 6));
        let b = parseInt(key.substring(7, 8));
        let c = parseInt(key.substring(9, 10));
        let todo = (array, value) => {
            this.props.dispatch(
                setGrid({
                    position: [array[0], array[1], array[2]],
                    value: value
                })
            );
            socket.emit("setGrid", {
                position: [array[0], array[1], array[2]],
                value: value
            });
        };
        let equal = (arrayA, arrayB) => {
            for (let i = 0; i < 3; i++) {
                if (arrayA[i] !== arrayB[i]) {
                    return false;
                }
            }
            return true;
        };

        //0
        if (equal([a, b, c], [0, 1, 1]) || equal([a, b, c], [4, 0, 0])) {
            todo([0, 1, 1], e.target.value);
            todo([4, 0, 0], e.target.value);
        }
        //1
        if (equal([a, b, c], [1, 1, 1]) || equal([a, b, c], [4, 0, 1])) {
            todo([1, 1, 1], e.target.value);
            todo([4, 0, 1], e.target.value);
        }
        //2
        if (equal([a, b, c], [2, 1, 1]) || equal([a, b, c], [4, 0, 2])) {
            todo([2, 1, 1], e.target.value);
            todo([4, 0, 2], e.target.value);
        }
        //3
        if (equal([a, b, c], [3, 1, 1]) || equal([a, b, c], [4, 1, 0])) {
            todo([3, 1, 1], e.target.value);
            todo([4, 1, 0], e.target.value);
        }

        //5
        if (equal([a, b, c], [5, 1, 1]) || equal([a, b, c], [4, 1, 2])) {
            todo([5, 1, 1], e.target.value);
            todo([4, 1, 2], e.target.value);
        }
        //6
        if (equal([a, b, c], [6, 1, 1]) || equal([a, b, c], [4, 2, 0])) {
            todo([6, 1, 1], e.target.value);
            todo([4, 2, 0], e.target.value);
        }
        //7
        if (equal([a, b, c], [7, 1, 1]) || equal([a, b, c], [4, 2, 1])) {
            todo([7, 1, 1], e.target.value);
            todo([4, 2, 1], e.target.value);
        }
        //
        if (equal([a, b, c], [8, 1, 1]) || equal([a, b, c], [4, 2, 2])) {
            todo([8, 1, 1], e.target.value);
            todo([4, 2, 2], e.target.value);
        }

        if (a == 4 && b == 1 && c == 1) {
            todo([4, 1, 1], e.target.value);
        }

        if (a !== 4 && !(b == 1 && c == 1)) {
            todo([a, b, c], e.target.value);
        }
    }

    onClick_ChangeSize() {
        this.setState({
            isEnlarge: !this.state.isEnlarge
        });
    }

    onClick_clearGrid() {
        this.props.dispatch(
            setGrid({
                position: "all",
                value: ""
            })
        );
        socket.emit("setGrid", {
            position: "all",
            value: ""
        });
    }

    onClick_closeGrid() {
        this.props.dispatch(setGridClose());
    }

    render() {
        let result = [];
        let order = [
            "first",
            "second",
            "third",
            "forth",
            "fifth",
            "sixth",
            "seventh",
            "eighth",
            "ninth"
        ];
        order.map((number, index) => {
            let name = "divTable" + " " + number;
            let innerGrid = [];
            for (let i = 0; i < 3; i++) {
                let outerKey = "grid" + ":" + index + ":" + i;
                let input = [];
                for (let j = 0; j < 3; j++) {
                    let innerKey = outerKey + ":" + j;
                    input.push(
                        <div className="divTableCell">
                            <textarea
                                className="TableInput"
                                value={this.props.grid[index][i][j]}
                                ref={innerKey}
                                data={innerKey}
                                placeholder={this.placeHolder[index][i][j]}
                                onChange={e => {
                                    this.onChangeInput(e);
                                }}
                            />
                        </div>
                    );
                }
                innerGrid.push(
                    <div className="divTableRow" data={outerKey}>
                        {input}
                    </div>
                );
            }
            result.push(<div className={name}>{innerGrid}</div>);
        });

        return (
            <div
                className="main-screen"
                id={this.state.isEnlarge ? "bigger" : ""}
            >
                {this.state.isEnlarge ? <div className="blackBG" /> : null}
                <div
                    className="gametoolbar"
                    id={this.state.isEnlarge ? "bigger" : ""}
                >
                    {this.state.isEnlarge ? (
                        <div
                            className="button2"
                            id="backtosmall"
                            onClick={this.onClick_ChangeSize}
                        >
                            縮小
                        </div>
                    ) : (
                        <div
                            className="button2"
                            id="fullscreen"
                            onClick={this.onClick_ChangeSize}
                        >
                            放大
                        </div>
                    )}
                    <div
                        className="button2"
                        id="reset"
                        onClick={() => {
                            this.onClick_clearGrid();
                        }}
                    >
                        清空
                    </div>
                    <div
                        className="button2"
                        id="dowload"
                        onClick={() => {
                            downloadCSV(this.props.grid);
                        }}
                    >
                        下載
                    </div>
                    <div
                        className="button2"
                        id="shutdown"
                        onClick={() => {
                            this.onClick_closeGrid();
                        }}
                    >
                        結束
                    </div>
                </div>
                {result}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        grid: state.grid.grid
    };
};
export default connect(mapStateToProps)(GridGame);
