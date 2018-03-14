const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {spawnArray} = require("./../array");
const {onSameIsoWeek} = require("./../date");

/* private
 -------------------------------------------------- */

function createDom(parentElement, _) {
	const dayCells = spawnArray(7, index => {
		return `<div class="nvm-day-cell">
			<span class="nvm-day">
				${_("day", moment().startOf("isoWeek").add(index, "day"))}
			</span>
			<span class="nvm-date"></span>
		</div>`;
	});

	return appendTo(
		parentElement,
		createElement(
			`<div class="nvm-table-header">
				<div class="nvm-week-cell"><span></span></div>
				${dayCells.join("")}
			</div>`
		)
	);
}


/* Component class
 -------------------------------------------------- */

class TableHeader {

	constructor(container) {
		// Create dom
		this.dom = createDom(container.dom.querySelector(".nvm-header"), container.lang);

		// Hook onto container
		container.once("initialize", () => this.render(container, this.dom));

		container.on("dateChange", (date, previousDate) => {
			if (!onSameIsoWeek(date, previousDate)) {
				this.render(container, this.dom)
			}
		});
	}

	render(container, dom) {
		const _ = container.lang;
		const date = container.getDate().startOf("isoWeek");

		// Iso week
		dom.querySelector(".nvm-week-cell span").innerHTML = _("isoWeek", date);

		// Day dates
		dom.querySelectorAll(".nvm-day-cell .nvm-date").forEach((dateCell, index) => {
			dateCell.innerHTML = _("date", date.clone().add(index, "day"));
		});
	}

}

module.exports = TableHeader;