import socket from "../socket";

const initialState = {
    userName:"",
    animalName:"",
    roomName:"",
    localUserID: "",
    localVideoURL: "",
    isStreaming: false,
    isSounding: false,
    connections: {}, //存放連線中的人的socket.id
    remoteStreamURL: {}, //存放連線中的人的stream
    remoteUserName: {},
    candidateQueue: {},
    isLocalShareScreen:false
};

export default function connection(state = initialState, action) {
    switch (action.type) {
        case "setUserName":
             return Object.assign({}, state, { userName: action.data });
        case "setAnimalName":
            return Object.assign({}, state, { animalName: action.data });
        case "setRoomName":
            return Object.assign({}, state, { roomName: action.data });
        case "setRemoteUserName":
            let userID = action.data.id;
            let userName = action.data.name;
            return {
                ...state,
                remoteUserName: {
                    ...state.remoteUserName,
                    [userID]: userName
                }
            };
        case "delRemoteUserName":
            return Object.assign({}, state, {
                remoteUserName: Object.keys(
                    state.remoteUserName
                ).reduce((result, key) => {
                    if (key !== action.data) {
                        result[key] = state.remoteUserName[key];
                    }
                    return result;
                }, {})
            });
        case "setLocalUserID":
            return Object.assign({}, state, { localUserID: action.data });

        case "gotLocalVideo":
        console.log(action)
            return Object.assign({}, state, { 
                'localVideoURL': action.data,
                'isLocalShareScreen': action.isShareScreen
            });
        
        case "turnOnUserAudio":
            return Object.assign({}, state, { isSounding: true });

        case "toggleAudio":
            return Object.assign({}, state, {
                isSounding: !state.isSounding
            });

        case "turnOnUserMedia":
            return Object.assign({}, state, { isStreaming: true });


        case "toggleUserMedia":
            return Object.assign({}, state, {
                isStreaming: !state.isStreaming
            });

        case "addParticipantConnection":
            return {
                ...state,
                connections: {
                    ...state.connections,
                    [action.data.id]: action.data.connectionObj
                }
            };
            window.connections = {
                ...state,
                connections: {
                    ...state.connections,
                    [action.data.id]: action.data.connectionObj
                }
            }
        case "delParticipantConnection":
            return Object.assign({}, state, {
                connections: Object.keys(
                    state.connections
                ).reduce((result, key) => {
                    if (key !== action.data) {
                        result[key] = state.connections[key];
                    }
                    return result;
                }, {})
            });
        case "addCandidateQueue":
            return {
                ...state,
                candidateQueue: {
                    ...state.candidateQueue,
                    [action.data.id]: action.data.candidate
                }
            };
        case "addRemoteStreamURL":
            return {
                ...state,
                remoteStreamURL: {
                    ...state.remoteStreamURL,
                    [action.data.remotePeer]: {
                        ...state.remoteStreamURL[action.data.remotePeer],
                        url: action.data.url,
                        isShareScreen: action.data.isShareScreen || false
                    }
                }
            };

        case "setRemoteVideoState":
            return {
                ...state,
                remoteStreamURL: {
                    ...state.remoteStreamURL,
                    [action.data.remotePeer]: {
                        ...state.remoteStreamURL[action.data.remotePeer],
                        isStreaming: action.data.isStreaming
                    }
                }
            };

        case "setRemoteAudioState":
            return {
                ...state,
                remoteStreamURL: {
                    ...state.remoteStreamURL,
                    [action.data.remotePeer]: {
                        ...state.remoteStreamURL[action.data.remotePeer],
                        isSounding: action.data.isSounding
                    }
                }
            };

        case "delRemoteStreamURL":
            if(action.data == 1){
                return {
                    ...state,
                    'remoteStreamURL' : {}
                }
            } else {
                return Object.assign({}, state, {
                    remoteStreamURL: Object.keys(
                        state.remoteStreamURL
                    ).reduce((result, key) => {
                        if (key !== action.data) {
                            result[key] = state.remoteStreamURL[key];
                        }
                        return result;
                    }, {})
                });
            }  
        default:
            return state;
    }
}
