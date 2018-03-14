const {createElement, appendTo, setClass} = require("./../dom");
const moment = require("moment");
const {spawnArray} = require("./../array");
const {interpolate} = require("./../math");
const {firstIsoWeekOfMonth, onSameIsoMonth, onSameIsoWeek, inInterval} = require("./../date");

/* private
 -------------------------------------------------- */

function createDom(parentElement) {
	const buttons = spawnArray(5, () => `<button class="nvm-set-week"></button>`);

	return appendTo(
		parentElement,
		createElement(
			`<div class="nvm-week-control">${buttons.join("")}</div>`
		)
	);
}


/* Component class
 -------------------------------------------------- */

class WeekControl {

	constructor(container) {
		// Create dom
		this.dom = createDom(container.dom.querySelector(".nvm-controls"));

		// Hook onto container
		container.once("initialize", () => {
			this.bind(container, this.dom);
			this.render(container, this.dom);
		});

		container.on("dateChange", (date, previousDate) => {
			if (!onSameIsoWeek(date, previousDate)) {
				this.render(container, this.dom);
			}
		});
	}

	bind(container, dom) {
		dom.querySelectorAll(".nvm-set-week").forEach((button, index) => {
			button.addEventListener("click", e => {
				e.preventDefault();
				e.stopPropagation();

				container.setDate(
					firstIsoWeekOfMonth(container.getDate()).add(index, "week")
				);
			});
		});
	}

	render(container, dom) {
		const _ = container.lang;
		const date = container.getDate();
		const start = firstIsoWeekOfMonth(date);
		const minDate = container.options.minDate ? container.options.minDate.clone().startOf("isoWeek") : null;
		const maxDate = container.options.maxDate ? container.options.maxDate.clone().endOf("isoWeek") : null;

		dom.querySelectorAll(".nvm-set-week").forEach((button, index) => {
			const week = start.clone().add(index, "week");

			// Label
			button.innerHTML = _("setWeek", week);

			// Active class
			setClass(button, "nvm-active", onSameIsoWeek(week, date));

			// Disabled
			button.disabled = !inInterval(week, minDate, maxDate);

			// Hide class
			setClass(button, "nvm-hidden", !onSameIsoMonth(week, date));
		});
	}

}

module.exports = WeekControl;