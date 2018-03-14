const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {spawnArray} = require("./../array");
const {interpolate} = require("./../math");

/* private
 -------------------------------------------------- */

function createDom(parentElement, _, minTime, maxTime) {
	const tickElements = spawnArray(maxTime - minTime + 1, index => {
		return `<span class="nvm-tick">
			${_("hour", moment().hour(minTime + index).startOf("hour"))}
		</span>`;
	});

	return appendTo(
		parentElement,
		createElement(
			`<div class="nvm-scale">${tickElements.join("")}</div>`
		)
	);
}

/* Component class
 -------------------------------------------------- */

class TimeScale {

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
		const _ = container.lang;

		dom.querySelectorAll(".nvm-tick").forEach((tick, index) => {
			tick.style.top = `${index / (maxTime - minTime) * 100}%`;
		});
	}

}

module.exports = TimeScale;