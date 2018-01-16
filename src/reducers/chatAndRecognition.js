const chatRoomState = {
    "interimResult":"",
	"isInChatNow": true,
	"recognitionRecord":[],
    "language":"cmn-Hant-TW"
};

export default function chatAndRecognition(state = chatRoomState, action) {
    switch (action.type) {
        case "changeToAnotherChannel":
            return  Object.assign({}, state, { "isInChatNow": !state.isInChatNow });
        case "addRecognitionRecord":
        	return Object.assign({},state,{
        		"recognitionRecord": state.recognitionRecord.concat(action.data)
        	})
        case "setInterimResult":
            return Object.assign({}, state, { "interimResult": action.data });
        case "setLanguage":
            return Object.assign({}, state, { "language": action.data });
        default:
            return state;
    }
}