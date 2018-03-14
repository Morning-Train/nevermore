const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {interpolate} = require("./../math");
const {dateMin, dateMax} = require("./../date");
const {Item} = require("./../item");

/* class
 -------------------------------------------------- */

class DragMove {

	constructor(container) {
		// Hook into container
		container.on("itemMount", item => this.bindItem(container, item, item.dom.querySelector(".nvm-item-body")));
	}

	bindItem(container, item, element) {
		// Offset in time from where the items was grabbed
		let dragOffset;
		let duration;

		element.addEventListener("mousedown", e => {
			const from = item.weekFrom(container.getDate());
			dragOffset = container.dateAtMouse(e).diff(from);
			duration = item.weekTo(container.getDate()).diff(from);
		});

		window.addEventListener("mousemove", e => {
			if (dragOffset != null) {
				const position = container.dateAtMouse(e);
				const from = position.clone().subtract(dragOffset);
				const to = from.clone().add(duration);

				container.updateItem(item, {from, to});
			}
		});

		window.addEventListener("mouseup", e => {
			if (dragOffset) {
				dragOffset = null;
				duration = null;
			}
		});
	}

}

module.exports = DragMove;