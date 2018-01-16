const initialData = {
    isRerservationDetailOpen:false,
	isReceivedData: false,
	meetingData: {},
    url: '',
};

export default function reservation(state = initialData, action) {
    switch (action.type) {
    	case 'setMeetingData':
    		return Object.assign({}, state, { meetingData: action.data });
    	case 'setURL':
    		return Object.assign({}, state, { url: action.data });
    	case 'setReceiveData':
    		return Object.assign({}, state, { isReceivedData: action.data });
        case 'setReservationDetailState':
            return Object.assign({}, state, { isRerservationDetailOpen: action.data });
        default:
            return state;
    }
}

