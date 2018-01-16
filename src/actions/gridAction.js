"use strict";

export function setGrid(positoinAndValue) {
	return {
		type: "setGrid",
		data: positoinAndValue
	};
}
export function setGridDetailOpen() {
	return {
		type: "setGridDetailOpen"
	};
}
export function setGridDetailClose() {
	return {
		type: "setGridDetailClose"
	};
}
export function setGridStart() {
	return {
		type: "setGridStart"
	};
}

export function setGridOpen() {
	return {
		type: "setGridOpen"
	};
}

export function setGridClose() {
	return {
		type: "setGridClose"
	};
}
