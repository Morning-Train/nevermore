const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {spawnArray} = require("./../array");
const {interpolate} = require("./../math");
const {firstIsoWeekOfMonth, onSameIsoMonth} = require("./../date");

/* private
 -------------------------------------------------- */

function createDom(parentElement, _) {
	return appendTo(
		parentElement,
		createElement(
			`<div class="nvm-month-control">
				<span></span>
				<button class="nvm-arrow nvm-arrow-left">${_("previousMonth")}</button>
				<button class="nvm-arrow nvm-arrow-right">${_("nextMonth")}</button>
			</div>`
		)
	);
}

/* Component class
 -------------------------------------------------- */

class MonthControl {

	constructor(container) {
		// Create dom
		this.dom = createDom(container.dom.querySelector(".nvm-controls"), container.lang);

		// Hook to container
		container.on("dateChange", (date, previousDate) => {
			if (!onSameIsoMonth(date, previousDate)) {
				this.render(container, this.dom);
			}
		});

		container.once("initialize", () => {
			this.bind(container, this.dom);
			this.render(container, this.dom);
		});
	}

	bind(container, dom) {
		// arrow left
		dom.querySelector(".nvm-arrow-left").addEventListener("click", e => {
			e.preventDefault();
			e.stopPropagation();

			container.setDate(
				firstIsoWeekOfMonth(container.getDate().subtract(1, "month"))
			);
		});

		// arrow right
		dom.querySelector(".nvm-arrow-right").addEventListener("click", e => {
			e.preventDefault();
			e.stopPropagation();

			container.setDate(
				firstIsoWeekOfMonth(container.getDate().add(1, "month"))
			);
		});
	}

	render(container, dom) {
		const date = container.getDate();
		const _ = container.lang;

		// display
		dom.querySelector("span").innerHTML = _("month", date);

		// arrow left
		dom.querySelector(".nvm-arrow-left").disabled = container.options.minDate ?
			firstIsoWeekOfMonth(date).isSameOrBefore(container.options.minDate) :
			false;

		// arrow right
		dom.querySelector(".nvm-arrow-right").disabled = container.options.maxDate ?
			firstIsoWeekOfMonth(date.clone().add(1, "month")).isAfter(container.options.maxDate) :
			false;

	}

}

module.exports = MonthControl;