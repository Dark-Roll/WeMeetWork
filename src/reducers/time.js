const timeState = [0, 0, 0];

export default function time(state = timeState, action) {
	switch (action.type) {
		case "setMeetingTime":
			return action.data;

		default:
			return state;
	}
}
