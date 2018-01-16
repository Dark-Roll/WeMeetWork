"use strict";

import React from "react";
import { connect } from "react-redux"
import { setAnimateClose } from '../../actions/Actions'

class VoteResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            winner: []
        }
        this.autoChange = undefined
    }

    componentWillMount() { }

    componentDidMount() {
        document.addEventListener("keydown", () => { this.onClick_ToggleNextPage() });
        if (this.state.page == 0) {
            this.autoChange = setTimeout(() => {
                this.onClick_ToggleNextPage()
            }, 1500)
        }
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", () => { this.onClick_ToggleNextPage() });
    }

    onClick_ToggleNextPage() {
        clearTimeout(this.autoChange)
        if (this.state.page == 0) {
            let option = {}
            let max = 1;
            let winner = []
            Object.keys(this.props.result).map((key) => {
                if (this.props.result[key].sum < max) {
                    return
                } else if (this.props.result[key].sum == max) {
                    winner.push(key)
                } else {
                    max = this.props.result[key].sum
                    winner = [key]
                }
            })

            this.setState({
                page: this.state.page + 1,
                winner: winner
            })
        } else if (this.state.page == 1) {
            this.props.dispatch(setAnimateClose())
            this.setState({
                page: 0
            })
        }
    }

    render() {
        let option = [];
        this.state.winner.map((winnerKey) => {
            Object.keys(this.props.votingOption).map((optionKey) => {
                if (optionKey == winnerKey) {
                    option.push(
                        <p className="result-ptag">
                            {this.props.votingOption[optionKey]}
                            <br />
                            票數：{this.props.result[optionKey].sum}票
                            <br />
                        </p>
                    )
                }
            })
        })

        return (
            <div className="black" onClick={() => { this.onClick_ToggleNextPage() }}>

                <div className={this.state.page == 0 ? 'visible' : 'hidden'}>
                    <div className="text one">投票結束</div>
                    <div className="text two">最後結果是...</div>
                </div>

                <div className={this.state.page == 1 ? 'visible' : 'hidden'}>
                    <div className="pyro">
                        <div className="before" />
                        <div className="after" />
                    </div>
                    <img className="animal" src="./img/voteimage.png" />
                    <div className="resulttext">
                        {option}
                        <br />
                    </div>
                    <div className="wintext">獲勝！</div>
                    <div className="triagle" />

                </div>

                {this.props.isFirstPageFinished ? <embed className='hidden' src="../img/congration.mp3" /> : null}

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        userName: state.connection.userName,
        animalName: state.connection.animalName,
        localUserID: state.connection.localUserID,
        isVotingStart: state.vote.isVotingStart,
        isVoteFinish: state.vote.isVoteFinish,
        isSelfSubmit: state.vote.isSelfSubmit,
        result: state.vote.result,
        votingOption: state.vote.voting.option
    };
};

export default connect(mapStateToProps)(VoteResult)
