const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {spawnArray} = require("./../array");
const {interpolate} = require("./../math");
const {firstIsoWeekOfMonth, onSameIsoMonth} = require("./../date");

/* private
 -------------------------------------------------- */

function createDom(parentElement) {
	return appendTo(
		parentElement,
		createElement(
			`<div class"nvm-item-actions"></div>`
		)
	);
}

/* class
 -------------------------------------------------- */

class ItemActions {

	constructor(container) {
		// Hook to container
		container.on("itemMount", item => {
			this.createItemDom(container, item);
		});
	}

	createItemDom(container, item) {
		createDom(item.dom.querySelector(".nvm-item-controls"));
	}


}

module.exports = ItemActions;