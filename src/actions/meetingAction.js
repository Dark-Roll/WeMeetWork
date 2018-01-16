"use strict";


export function setAnimalName(name) {
	return {
		type: "setAnimalName",
		data: name
	};
}
export function setUserName(name) {
	return {
		type: "setUserName",
		data: name
	};
}

export function showAdvice(advice) {
	return {
		type: "showAdvice",
	};
}

export function setRoomName(name) {
	return {
		type: "setRoomName",
		data: name
	};
}

export function setRemoteUserName(name) {
	return {
		type: "setRemoteUserName",
		data: name
	};
}

export function delRemoteUserName(id) {
	return {
		type: "delRemoteUserName",
		data: id
	};
}

export function setLocalUserID(id) {
	return {
		type: "setLocalUserID",
		data: id
	};
}
export function setParticipantList(participantList) {
	return {
		type: "setParticipantList",
		data: participantList
	};
}

export function addParticipantList(participantID) {
	return {
		type: "addParticipantList",
		data: participantID
	};
}

export function delParticipantList(participantID) {
	return {
		type: "delParticipantList",
		data: participantID
	};
}

export function setRoomList(roomList) {
	return {
		type: "setRoomList",
		data: roomList
	};
}

export function addRoom(room) {
	return {
		type: "addRoom",
		data: room
	};
}

export function delRoom(room) {
	return {
		type: "delRoom",
		data: room
	};
}

export function gotLocalVideo(url,isShareScreen) {
	return {
		type: "gotLocalVideo",
		data: url,
		isShareScreen: isShareScreen
	};
}
export function turnOnUserAudio() {
	return {
		type: "turnOnUserAudio"
	};
}
export function toggleAudio() {
	return {
		type: "toggleAudio"
	};
}

export function turnOnUserMedia() {
	return {
		type: "turnOnUserMedia"
	};
}
export function toggleUserMedia() {
	return {
		type: "toggleUserMedia"
	};
}

export function addParticipantConnection(participantObj) {
	return {
		type: "addParticipantConnection",
		data: participantObj
	};
}

export function delParticipantConnection(participantObj) {
	return {
		type: "delParticipantConnection",
		data: participantObj
	};
}

export function addRemoteStreamURL(stateObj,isShareScreen) {
	return {
		type: "addRemoteStreamURL",
		data: stateObj,
	};
}

export function setRemoteVideoState(stateObj) {
	return {
		type: "setRemoteVideoState",
		data: stateObj
	};
}

export function setRemoteAudioState(stateObj) {
	return {
		type: "setRemoteAudioState",
		data: stateObj
	};
}

export function delRemoteStreamURL(id) {
	return {
		type: "delRemoteStreamURL",
		data: id
	};
}

export function addCandidateQueue(candidateObj) {
	return {
		type: "addCandidateQueue",
		data: candidateObj
	};
}

export function setMeetingTime(timeArray) {
	return {
		type: "setMeetingTime",
		data: timeArray
	};
}
