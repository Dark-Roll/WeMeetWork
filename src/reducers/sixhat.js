const initialState = {
    hatList:{
        'mock':0
    },
	isSixhatDetailOpen:false,
    isSixhatOpen: false
};

export default function sixhat(state = initialState, action) {
    switch (action.type) { 
        case "setSixhatList":
            return {
                ...state,
                isSixhatDetailOpen:false,
                isSixhatOpen:true,
                hatList: action.data
            }

    	case "setSixhatDetailOpen":
            return Object.assign({}, state, { isSixhatDetailOpen: true });
        case "setSixhatDetailClose":
            return Object.assign({}, state, { isSixhatDetailOpen: false });

        case "setSixhatOpen":
            return Object.assign({}, state, { isSixhatOpen: true });
        case "setSixhatClose":
            return Object.assign({}, state, { isSixhatOpen: false });
        default:
            return state;
    }
}
