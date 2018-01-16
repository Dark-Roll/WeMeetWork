"use strict";

import React from "react";
import { connect } from "react-redux";
import {
    setGridDetailOpen,
    setGridOpen,
    setGridClose,
    setPaintOpen,
    setPaintClose,
    setSixhatDetailOpen,
    setSixhatOpen,
    setSixhatClose
} from "../../actions/Actions"

class Brainstorming extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    onClick_ToggleGridGame() {
        this.props.closeBrainStorming()
        this.props.dispatch(setGridDetailOpen())
    }

    onClick_ToggleSixHatGame() {
        this.props.closeBrainStorming()
        this.props.dispatch(setSixhatDetailOpen())
    }

    render() {
        return (
            <div className="brainstorming">
                <div
                    className="toolbar-button"
                    id="grid"
                    onClick={() => { this.onClick_ToggleGridGame() }}
                >
                    <div className="hovertext" id="grid">九宮格發散法</div>
                </div>

                <div
                    className="toolbar-button"
                    id="sixhat"
                    onClick={() => { this.onClick_ToggleSixHatGame() }}
                >
                    <div className="hovertext" id="sixhat">六頂思考帽法</div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isPaintOpen: state.paint.isPaintOpen,
        isGridOpen: state.grid.isGridOpen,
    };
};

export default connect()(Brainstorming);
