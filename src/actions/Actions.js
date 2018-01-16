"use strict";
export {
	setUserName,
	setAnimalName,
	setRoomName,
	setRemoteUserName,
	delRemoteUserName,
	setLocalUserID,
	setParticipantList,
	addParticipantList,
	delParticipantList,
	setRoomList,
	addRoom,
	delRoom,
	gotLocalVideo,
	turnOnUserAudio,
	toggleAudio,
	turnOnUserMedia,
	toggleUserMedia,
	addParticipantConnection,
	delParticipantConnection,
	addRemoteStreamURL,
	setRemoteVideoState,
	setRemoteAudioState,
	delRemoteStreamURL,
	addCandidateQueue,
	setMeetingTime,
	adviceSend
} from './meetingAction';

export {
	setVotingDetail,
	setSecretOrNot,
	setVotingStart,
	gotVoteFromServer,
	setVotingFinish,
	selfSubmitVote,
	waitingForAnimate,
	setAnimateOpen,
	setAnimateClose,
	setVotingDetailState
} from './voteAction'


export {
	setAgenda,
	newAgenda,
	deleteAgenda,
	doneAgenda,
	updateAgenda
} from './agendaAction'

export {
	changeToAnotherChannel,
	addRecognitionRecord,
	setInterimResult,
	setLanguage
} from './chatAndRecognitionAction'

export {
	setGrid,
	setGridDetailOpen,
	setGridDetailClose,
	setGridStart,
	setGridOpen,
	setGridClose
} from "./gridAction"

export {
	setPaintOpen,
	setPaintClose
} from "./paintAction"

export {
	setSixhatDetailOpen,
	setSixhatDetailClose,
	setSixhatOpen,
	setSixhatClose,
	setSixhatList,
	setLocalHat,
	setSixhat
} from './sixhatAction'

export {
	setMeetingData,
	setURL,
	setReceiveData,
	setReservationDetailState
} from './reservationAction'

export function addChatRecord(recordObj) {
	return {
		type: "addChatRecord",
		data: recordObj
	};
}

export function setBrainStormingState(boolean) {
	return {
		type: "setBrainStormingState",
		data: boolean
	};
}
