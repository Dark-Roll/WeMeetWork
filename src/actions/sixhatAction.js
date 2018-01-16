"use strict";

export function setSixhatDetailOpen() {
	return {
		type: "setSixhatDetailOpen"
	};
}

export function setSixhatDetailClose() {
	return {
		type: "setSixhatDetailClose"
	};
}

export function setSixhatOpen() {
	return {
		type: "setSixhatOpen"
	};
}

export function setSixhatClose() {
	return {
		type: "setSixhatClose"
	};
}

export function setSixhatList(obj) {
	return {
		type: "setSixhatList",
		data: obj
	};
}

export function setLocalHat(hat) {
	return {
		type: "setLocalHat",
		data: hat
	};
}

export function setSixhat(local,obj) {
	return {
		type: "setSixhat",
		local: local,
		list: obj
	};
}

