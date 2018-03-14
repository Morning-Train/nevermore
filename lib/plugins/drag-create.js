const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {interpolate} = require("./../math");
const {dateMin, dateMax, boundDateWithin, getLowerBoundIsoDay, boundedByIsoDay, normalizeIsoDayOfWeek} = require("./../date");
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

				// Bound within start and end of day
				boundDate = boundDateWithin(boundDate, container.startOfDay(boundDate), container.endOfDay(boundDate));

				const from = dateMin(anchorDate, boundDate);
				const to = dateMax(anchorDate, boundDate);

				const boundDay = getLowerBoundIsoDay(to);

				// Update anchor date to be on same day
				if (!boundedByIsoDay(from, boundDay)) {
					from.date(from.clone().startOf("isoWeek").add(boundDay, "day").date());
				}

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