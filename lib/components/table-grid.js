const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {spawnArray} = require("./../array");
const {interpolate} = require("./../math");

/* private
 -------------------------------------------------- */

function createDom(parentElement, _, minTime, maxTime) {
	const dayElements = spawnArray(7, () => {
		const hourElements = spawnArray(maxTime - minTime, () => `<div class="nvm-grid-hour"></div>`);
		return `<div class="nvm-grid-day">${hourElements.join("")}</div>`;
	});

	return appendTo(
		parentElement,
		createElement(
			`<div class="nvm-grid">${dayElements.join("")}</div>`
		)
	);
}

/* Component class
 -------------------------------------------------- */

class TableGrid {

	constructor(container) {
		// Create dom
		this.dom = createDom(
			container.dom.querySelector(".nvm-body"),
			container.lang,
			container.options.minTime,
			container.options.maxTime
		);

		// Hook onto container
		container.once("initialize", () => this.render(container, this.dom));
	}

	render(container, dom) {
		const minTime = container.options.minTime;
		const maxTime = container.options.maxTime;
		const hourHeight = 100 / (maxTime - minTime);

		dom.querySelectorAll(".nvm-grid-hour").forEach((hourElement) => {
			hourElement.style.height = `${hourHeight}%`;
		});
	}

}

module.exports = TableGrid;