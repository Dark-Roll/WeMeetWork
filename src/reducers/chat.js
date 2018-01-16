const chatRecord = [];

export default function chat(state = chatRecord, action) {
    switch (action.type) {
        case "addChatRecord":
            return state.concat(action.data); 

        default:
            return state;
    }
}