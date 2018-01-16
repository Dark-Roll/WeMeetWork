"use strict";

import React from "react";
import { connect } from "react-redux";
import socket from "../../socket";
import { setSixhatClose } from "../../actions/Actions"

class SixHatGame extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isSameHatType: false,
			WhatPage: "one"
		};
		this.onClick_ChangeGameType = this.onClick_ChangeGameType.bind(this);
		this.onClick_ChangeIntroduction = this.onClick_ChangeIntroduction.bind(
			this
		);
		this.onClick_ChangeExample = this.onClick_ChangeExample.bind(this);
		this.onClick_ChangeOrder = this.onClick_ChangeOrder.bind(this);
		this.sixhat = [
			[
				"white",
				{
					description: "中立、客觀",
					needtodo: "要陳述問題事實",
					indrotuction:
						"根據事實與資訊的思考，在問題分析流程中的「界定問題」及「蒐集資訊」時，區分哪些是事實，那些只是意見。",
					example: ["我們擁有哪些資訊?", "少了那些資訊?", "告訴我有關員工離職率的相關資料"]
				}
			],
			[
				"red",
				{
					description: "直覺、情感",
					needtodo: "對方案進行直覺的判斷",
					indrotuction:
						"紅色思考帽允許人們將感覺、直覺放進來，不用道歉，不用解釋，也不必想辦法為自己的行為辯解。團隊可適時的宣洩對事情的直觀看法，有助於了解方案的可行性。",
					example: [
						"我不喜歡這件事情的處理方式。",
						"我的直覺告訴我，價格很快就會跌來。",
						"少了那些資訊?",
						"告訴我有關員工離職率的相關資料"
					]
				}
			],
			[
				"black",
				{
					description: "謹慎、負面",
					needtodo: "評估與建議之缺點",
					indrotuction:
						"對事物的負面因素進行邏輯判斷和評估。在問題分析與解決過程當中以及風險評估，蒐集資訊需要用到黑帽思考。",
					example: [
						"遜斃了、好爛哦",
						"缺點在那兒?",
						"折扣可在短期內創造更多營收，但長遠來看，改善產品、調整售價才是根本解決的方法。"
					]
				}
			],
			[
				"green",
				{
					description: "創意、巧思",
					needtodo: "提出如何解決問題的建議",
					indrotuction:
						"創意與突破思考。綠色代表創造力、新觀點、新想法、新做法。綠色思考帽是不受傳統或規章的限制，是勇於突破找出新方法的思考模式。",
					example: ["這個點子新喔!", "有沒有新的想法/新的建議/新的假設", "還有什麼原因會造成這個問題呢?"]
				}
			],
			[
				"yellow",
				{
					description: "積極、正面",
					needtodo: "評估與建議之優點",
					indrotuction:
						"樂觀與正面思考。企劃的過程當中，需要黃帽思考來探求事物的優點以及可行性並提供某個觀點行得通的邏輯支持。問題分析解決過程當中，黃帽思考是鼓舞團隊前進的原動力。",
					example: ["好主意！", "值得試試看", "就算這項計畫失敗了，我們至少學到很多經驗"]
				}
			],
			[
				"blue",
				{
					description: "統整、控制",
					needtodo: "總結陳述，得出方案",
					indrotuction:
						"它可以控制何時運用各個顏色帽子的使用時機，藍色思考帽是思考的總管!藍帽可以在開始的時候決定思考目的與方法；在中間的時候提醒思考目的；在結束的時候檢驗思考的成果。",
					example: ["我們目前做了什麼?", "我們下一步要做什麼?", "我們的結論是什麼?"]
				}
			]
		];
	}

	componentWillMount() {}

	componentDidMount() {}

	setRandomHat() {
		let numberOfParticipant = this.props.participantList.length;
		let arr = [0, 1, 2, 3, 4, 5];
		let final = [];
		for (let i = 0; i < numberOfParticipant; i++) {
			let randomNumber = Math.floor(Math.random() * (6 - i));
			final.push(arr[randomNumber]);
			arr.splice(randomNumber, 1);
		}
		socket.emit("setAllUserRandomHat", final);
	}

	onClick_ChangeGameType() {
		this.setState({
			isSameHatType: !this.state.isSameHatType
		});
	}

	onClick_ChangeIntroduction() {
		this.setState({
			WhatPage: "one"
		});
	}

	onClick_ChangeExample() {
		this.setState({
			WhatPage: "two"
		});
	}

	onClick_ChangeOrder() {
		this.setState({
			WhatPage: "three"
		});
	}

	render() {
		console.log(this.props.focusingOnWhichUser)
		let Content;
		let localHat = 1;
		let others = [];

		Object.keys(this.props.hatList).map(participantID => {
			let hatKey = this.props.hatList[participantID];
			if (participantID == this.props.localUserID) {
				localHat = hatKey;
				let img = `./img/other_${this.sixhat[hatKey][0]}.png`;
				others.unshift(
					<div className="other-hat">
						<div className="hat-text">
							{this.sixhat[hatKey][1].description}的代表
						</div>
						<img
							className="hat-img"
							onMouseOver={this.OthersTextappear}
							src={img}
						/>
					</div>
				);
			} else {
				let img = `./img/other_${this.sixhat[hatKey][0]}.png`;
				others.push(
					<div className="other-hat">
						<div className="hat-text">
							{this.sixhat[hatKey][1].description}的代表
						</div>
						<img
							className="hat-img"
							onMouseOver={this.OthersTextappear}
							src={img}
						/>
					</div>
				);
			}
		});
		switch (this.state.WhatPage) {
			case "one":
				Content = <ul><img className="sixhat-order" src="./img/sixhat_order.png" /></ul>;
				break;
			case "two":
				Content = <ul>{this.sixhat[localHat][1].indrotuction}</ul>;
				break;
			case "three":
				let li = this.sixhat[localHat][1].example.map(string => {
					return <li>{string}</li>;
				});
				Content = <ul>{li}</ul>;
				break;
		}

		let bigStoryImg = '';
		let bigHatImg = '';
		let bigHatKey = '';
		bigHatKey = this.props.hatList[this.props.focusingOnWhichUser.id] || 0
		bigStoryImg = `./img/${this.sixhat[bigHatKey][0]}hat.png`
		bigHatImg = `./img/sixhat_${this.sixhat[bigHatKey][0]}.png`

		return (
			<div className="sixhat-field">
				<div className="bigscreen-sixhat">
					<div className="teaching">
						<img className="content-img" src={bigStoryImg} />
						<div className="teachinglist">
							<div
								className="button3"
								onClick={this.onClick_ChangeIntroduction}
							>
								發言順序
							</div>
							<div
								className="button3"
								onClick={this.onClick_ChangeExample}
							>
								介紹
							</div>
							<div
								className="button3"
								onClick={this.onClick_ChangeOrder}
							>
								舉例
							</div>
							<div className="bottom">
								<div
									className="focus"
									id={this.state.WhatPage}
								/>
							</div>
						</div>

						<div className="teachingcontent">{Content}</div>
					</div>
					<img
						className="hat-img"
						src={bigHatImg}
					/>

					<div
						className="hat-type"
						id={
							this.sixhat[bigHatKey][0]
						}
					>
						{
							this.sixhat[bigHatKey][1].description
						}的代表
					</div>
					<div
						className="hat-text"
						id={
							this.sixhat[bigHatKey][0]
						}
					>
						{
							this.sixhat[bigHatKey][1].needtodo
						}
					</div>
				</div>

				<div className="others-sixhat">{others}</div>
				<div
					className="button1"
					id="changehat"
					onClick={() => {
						this.setRandomHat();
					}}
				/>

				<div className="button1" id="exit" onClick={()=>{this.props.dispatch(setSixhatClose())}}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		localUserID: state.connection.localUserID,
		participantList: state.participantList,
		hatList: state.sixhat.hatList
	};
};

export default connect(mapStateToProps)(SixHatGame);
