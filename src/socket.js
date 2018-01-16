import socketIO from "socket.io-client";
import store from "./store";
import {
    setUserName,
    setAnimalName,
    setRoomList,
    setRemoteUserName,
    addRoom,
    delRoom,
    setParticipantList,
    addParticipantList,
    delParticipantList,
    addChatRecord,
    setRemoteVideoState,
    setRemoteAudioState,
    setVotingDetail,
    setVotingStart,
    gotVoteFromServer,
    waitingForAnimate,
    setVotingFinish,
    setAgenda,
    newAgenda,
    deleteAgenda,
    updateAgenda,
    doneAgenda,
    addRecognitionRecord,
    setGrid,
    setSixhatList,
    setLocalHat,
    setSixhat,
    setMeetingData,
    setURL,
    setReceiveData,
    delParticipantConnection,
    delRemoteStreamURL,
    delRemoteUserName,
    setGridStart,
    setGridOpen
} from "./actions/Actions";

let io = socketIO();
let socket = io.connect("https://140.123.175.95:443");

socket
    .on('setRoomList', list=>{
        console.log('收一波')
        if (list.length) {
            store.dispatch(setRoomList(list));
        }
    })
    .on("setRemoteUserName", idAndName => {
        store.dispatch(setRemoteUserName(idAndName));
    })
    .on("addRoom", room => {
        store.dispatch(addRoom(room));
    })
    .on("delRoom", room => {
        store.dispatch(delRoom(room));
    });

socket
    .on("setParticipantList", participantList => {
        store.dispatch(setParticipantList(participantList));
        store.dispatch(setAnimalName(participantList[0].animal));
        socket.emit("joinFinish");
    })
    .on("addParticipantList", participantID => {
        store.dispatch(addParticipantList(participantID));
    })
    .on("delParticipantList", participantID => {
        store.dispatch(delParticipantList(participantID));
        store.dispatch(delParticipantConnection(participantID));
        store.dispatch(delRemoteStreamURL(participantID));
        store.dispatch(delRemoteUserName(participantID));
    });

socket.on("chatMessage", record => {
    store.dispatch(addChatRecord(record));
});

socket
    .on("setRemoteVideoState", (state, remotePeer) => {
        store.dispatch(
            setRemoteVideoState({ isStreaming: state, remotePeer: remotePeer })
        );
    })
    .on("setRemoteAudioState", (state, remotePeer) => {
        store.dispatch(
            setRemoteAudioState({ isSounding: state, remotePeer: remotePeer })
        );
    });

socket
    .on("gotCreateVote", (votingDetail,time) => {
        store.dispatch(setVotingDetail(votingDetail));
        store.dispatch(setVotingStart(time));
    })
    .on("gotVoteFromServer", voteContent => {
        store.dispatch(gotVoteFromServer(voteContent));
    })
    .on("votingIsFinish", () => {
        let date = new Date();
        //自定義時間格式:Hour-Minute
        let formattedTime = `${date.getHours()}:${(date.getMinutes() < 10 ? "0" : "")}${date.getMinutes()}:${date.getSeconds()}`
        store.dispatch(waitingForAnimate(formattedTime));
    });

socket
    .on("setAgenda", function(list) {
        store.dispatch(setAgenda(list));
    })
    .on("newAgenda", () => {
        store.dispatch(newAgenda());
    })
    .on("deleteAgenda", key => {
        store.dispatch(deleteAgenda(key));
    })
    .on("updateAgenda", obj => {
        store.dispatch(updateAgenda(obj));
    })
    .on("doneAgenda", key => {
        store.dispatch(doneAgenda(key));
    });

socket.on("remoteUserRecognitionRecord", history => {
    store.dispatch(addRecognitionRecord(history));
});

socket
    .on("setGrid", obj => {
        store.dispatch(setGrid(obj));
    })
    .on("setGridStart", () => {
        if(store.isGridDetailOpen){
            store.dispatch(setGridDetailClose()); 
        }
        if(store.isBrainstormingOpen){
            store.dispatch(setBrainStormingState(false))
        }
        if(store.isSixhatDetailOpen){
            store.dispatch(setSixhatDetailClose()); 
        }
        if(store.isRerservationDetailOpen){
            store.dispatch(setReservationDetailState(false))
        }
        if(store.isPaintOpen){
            store.dispatch(setPaintClose());
        }
        if(store.isVotingDetailOpen){
            store.dispatch(setVotingDetailState(false))
        }
        store.dispatch(setGridStart());
        store.dispatch(setGridOpen());
    });

socket.on("setSixhatList", (obj) => {
    store.dispatch(setSixhatList(obj));
});

socket.on("AddReservation", data => {
    store.dispatch(setMeetingData(data));
    store.dispatch(setURL(data.href));
    store.dispatch(setReceiveData(true));
});

export default socket;
