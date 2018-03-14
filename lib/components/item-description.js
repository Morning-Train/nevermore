const {createElement, appendTo} = require("./../dom");
const moment = require("moment");
const {spawnArray} = require("./../array");
const {interpolate} = require("./../math");

/* private
 -------------------------------------------------- */

function createDom(parentElement) {
	return appendTo(
		parentElement,
		createElement(
			`<div class="nvm-item-description">
				<span class="nvm-item-interval"></span>
				<span class="nvm-item-frequency"></span>
			</div>`
		)
	);
}

/* Component class
 -------------------------------------------------- */

class ItemDescription {

	constructor(container, options) {
		// Bind container hooks
		container.on("itemMount", item => {
			this.createItemDom(item);
			this.render(container, item);
		});

		container.on("itemChange", item => this.render(container, item));
	}

	createItemDom(item) {
		createDom(item.dom.querySelector(".nvm-item-header"));
	}

	render(container, item) {
		const _ = container.lang;

		// interval
		item.dom.querySelector(".nvm-item-interval").innerHTML = `${_("hour", item.from)} - ${_("hour", item.to)}`;

		// frequency
		item.dom.querySelector(".nvm-item-frequency").innerHTML = item.repeats ? _("allWeeks") : _("dayDate", item.from);
	}
}

module.exports = ItemDescription;