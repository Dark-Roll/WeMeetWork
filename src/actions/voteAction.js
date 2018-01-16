"use strict";
export function setVotingDetail(votingDetail) {
	return {
		type: "setVotingDetail",
		data: votingDetail
	};
}

export function setSecretOrNot(YesOrNo) {
	return {
		type: "setSecretOrNot",
		data: YesOrNo
	};
}

export function setVotingStart(createTime) {
	return {
		type: "setVotingStart",
		time:createTime
	};
}

export function gotVoteFromServer(voteContent) {
	return {
		type: "gotVoteFromServer",
		data: voteContent 
	};
}

export function setVotingFinish() {
	return {
		type: "setVotingFinish" 
	};
}

export function selfSubmitVote() {
	return {
		type: "selfSubmitVote" 
	};
}

export function waitingForAnimate(finishTime) {
	return {
		type: "waitingForAnimate",
		time:finishTime
	};
}

export function setAnimateOpen() {
	return {
		type: "setAnimateOpen" 
	};
}

export function setAnimateClose() {
	return {
		type: "setAnimateClose" 
	};
}

export function setVotingDetailState(boolean) {
	return {
		type: "setVotingDetailState",
		data:boolean
	};
}
