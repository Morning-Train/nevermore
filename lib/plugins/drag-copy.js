const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {spawnArray} = require("./../array");
const {interpolate, getFraction} = require("./../math");
const {firstIsoWeekOfMonth, onSameIsoMonth, normalizeIsoDayOfWeek, copyTime} = require("./../date");

/* private
 -------------------------------------------------- */

function createDom(parentElement) {
	appendTo(
		parentElement,
		createElement(
			`<div class="nvm-grabber nvm-grabber-left"></div>`
		)
	);

	appendTo(
		parentElement,
		createElement(
			`<div class="nvm-grabber nvm-grabber-right"></div>`
		)
	);

	return parentElement;
}

/* class
 -------------------------------------------------- */

class DragCopy {

	constructor(container) {
		// Initialize when item is mount
		container.on("itemMount", item => {
			this.createItemDom(container, item);
			this.bindItem(container, item);
		});
	}

	createItemDom(container, item) {
		createDom(item.dom.querySelector(".nvm-item-controls"));
	}

	bindItem(container, item) {
		let direction;
		let startDay;

		const initCopy = (e, dir) => {
			direction = dir;
			startDay = normalizeIsoDayOfWeek(container.dateAtMouse(e).day());
		};

		item.dom.querySelector(".nvm-grabber-left").addEventListener("mousedown", e => initCopy(e, -1));

		item.dom.querySelector(".nvm-grabber-right").addEventListener("mousedown", e => initCopy(e, 1));

		window.addEventListener("mouseup", () => {
			direction = null;
			startDay = null;
		});

		window.addEventListener("mousemove", e => {
			if (direction != null) {
				const mouseDate = container.dateAtMouse(e);
				const mouseDay = container.dayAtMouse(e);
				const mouseDayOverlap = getFraction(container.dayAtMouse(e, true));

				if (
					(mouseDayOverlap >= container.options.copyOverlap) &&
					((direction === 1 && mouseDay > startDay) || (direction === -1 && mouseDay < startDay))
				) {
					// update to avoid adding more than once
					startDay = mouseDay;

					container.addItem(item.clone({
						from: copyTime(mouseDate.clone(), item.from),
						to: copyTime(mouseDate.clone(), item.to)
					}));
				}
			}
		});
	}

}

module.exports = DragCopy;