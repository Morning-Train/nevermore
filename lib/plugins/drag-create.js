const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {interpolate} = require("./../math");
const {dateMin, dateMax, isTimeAfter, isDayBoundary, normalizeIsoDayOfWeek} = require("./../date");
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
				let boundDate = container.dateAtMouse(e);

				// TODO: FIX THIS

				anchorDate.date(
					boundDate.date()
				);

				const from = dateMin(anchorDate, boundDate);
				const to = dateMax(anchorDate, boundDate);

				container.updateItem(currentItem, {from, to}, {
					silent: true, durationFilter: anchorDate.isSame(to) ? "resizeFrom" : "resizeTo"
				});
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