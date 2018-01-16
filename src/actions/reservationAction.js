"use strict";

export function setMeetingData(data) {
	return {
		type: "setMeetingData",
		data: data
	};
}

export function setURL(url) {
	return {
		type: "setURL",
		data: url
	};
}

export function setReceiveData(boolean) {
	return {
		type: "setReceiveData",
		data: boolean
	};
}

export function setReservationDetailState(boolean) {
	return {
		type: "setReservationDetailState",
		data: boolean
	};
}
