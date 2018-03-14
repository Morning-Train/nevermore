const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {interpolate} = require("./../math");
const {dateMin, dateMax} = require("./../date");
const {Item} = require("./../item");

/* class
 -------------------------------------------------- */

class DragCreate {

	constructor(container) {
		container.once("initialize", () => {
			this.bind(container, container.dom.querySelector(".nvm-table-body"));
		});
	}

	bind(container, element) {
		// drag initial date
		let currentItem;
		let anchorDate;

		element.addEventListener("mousedown", e => {
			if (e.target === element) {
				const newAnchorDate = container.dateAtMouse(e);
				const newItem = new Item({from: newAnchorDate.clone(), to: newAnchorDate.clone()});

				container.mountItem(newItem, {durationFilter: "resizeTo"}).then(() => {
					currentItem = newItem;
					anchorDate = newAnchorDate;
				});
			}
		});

		window.addEventListener("mousemove", e => {
			if (currentItem) {
				const boundDate = container.dateAtMouse(e);

				// Update anchor date to be on same day
				anchorDate.date(boundDate.date());

				const from = dateMin(anchorDate, boundDate);
				const to = dateMax(anchorDate, boundDate);

				container.updateItem(currentItem, {from, to}, {silent: true, durationFilter: "resizeTo"});
			}
		});

		window.addEventListener("mouseup", e => {
			if (currentItem) {
				container.addItem(currentItem);
				currentItem = null;
				anchorDate = null;
			}
		});

	}

}

module.exports = DragCreate;