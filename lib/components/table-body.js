const {createElement, appendTo, removeElement, setClass} = require("./../dom");
const moment = require("moment");
const {spawnArray} = require("./../array");
const {interpolate, extrapolate} = require("./../math");
const {inIsoWeek, extrapolateDate, normalizeIsoDayOfWeek, onSameIsoWeek, interpolateDate} = require("./../date");

/* private
 -------------------------------------------------- */

function createDom(parentElement) {
	return appendTo(
		parentElement,
		createElement(
			`<div class="nvm-table-body"></div>`
		)
	);
}

/* Component class
 -------------------------------------------------- */

class TableBody {

	constructor(container) {
		// Create dom
		this.dom = createDom(container.dom.querySelector(".nvm-body"));

		// Set dateAtMouse helper
		container.dateAtMouse = (e) => {
			const rect = this.dom.getBoundingClientRect();

			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const left = Math.max(0, Math.min(0.99, x / rect.width));
			const top = Math.max(0, Math.min(1, y / rect.height));

			const day = Math.floor(interpolate(left, 0, 7));
			const date = container.getDate().startOf("isoWeek").add(day, "day");

			const minTime = date.clone().startOf("day").add(container.options.minTime, "hour");
			const maxTime = date.clone().startOf("day").add(container.options.maxTime, "hour");

			return interpolateDate(top, minTime, maxTime);
		};

		// Set day at mouse helper
		container.dayAtMouse = (e, precise = false) => {
			const rect = this.dom.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const day = interpolate(x / rect.width, 0, 7);

			return precise ? day : Math.floor(day);
		};

		// Hook onto container
		container.on("dateChange", (date, previousDate) => {
			if (!onSameIsoWeek(date, previousDate)) {
				this.renderItems(container);
			}
		});

		container.on("itemMount", (item) => this.renderItem(container, item));
		container.on("itemUnmount", (item) => this.removeItem(container, item));
		container.on("itemChange", (item) => this.renderItem(container, item));
	}

	renderItemLocation(container, item) {
		const date = container.getDate();
		const start = item.weekFrom(date).startOf("day").add(container.options.minTime, "hour");
		const end = item.weekFrom(date).startOf("day").add(container.options.maxTime, "hour");

		const left = extrapolate(normalizeIsoDayOfWeek(item.from), 0, 7);
		const top = extrapolateDate(item.weekFrom(date), start, end);
		const height = extrapolateDate(item.weekTo(date), start, end) - top;

		item.dom.style.left = `${left * 100}%`;
		item.dom.style.top = `${top * 100}%`;
		item.dom.style.height = `${height * 100}%`;
	}

	renderItem(container, item) {
		const date = container.getDate();
		const from = item.from;

		if ((!item.repeats && inIsoWeek(from, date)) || (item.repeats && item.repeatsOn(date))) {
			// Set class if repeater
			setClass(item.dom, "nvm-repeater-item", item.repeats);

			this.renderItemLocation(container, item);
			this.addItem(container, item);
		}
		else {
			this.removeItem(container, item)
		}

	}

	renderItems(container) {
		container.items.forEach(item => this.renderItem(container, item));
	}

	addItem(container, item) {
		appendTo(this.dom, item.dom);
	}

	removeItem(container, item) {
		removeElement(item.dom);
	}

}

module.exports = TableBody;