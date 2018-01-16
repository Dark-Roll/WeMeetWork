"use strict";

export function changeToAnotherChannel() {
	return {
		type: "changeToAnotherChannel"
	};
}

export function addRecognitionRecord(recordObj) {
	return {
		type: "addRecognitionRecord",
		data: recordObj
	};
}

export function setInterimResult(result) {
	return {
		type: "setInterimResult",
		data: result
	};
}

export function setLanguage(language) {
	return {
		type: "setLanguage",
		data: language
	};
}
