const moment = require("moment");
const assign = require("object-assign");
const {createElement, appendTo, addClass} = require("./dom");
const {createPipeline} = require("cleopatra");
const {normalizeDate, normalizeIsoDayOfWeek} = require("./date");
const {pluckKeysExcept, cloneObject} = require("./object");

/* private
 -------------------------------------------------- */

function createItemDom() {
	return createElement(
		`<div class="nvm-item">
			<div class="nvm-item-controls"></div>
			<div class="nvm-item-body">
				<div class="nvm-item-header"></div>
				<div class="nvm-item-footer"></div>
			</div>
		</div>`
	);
}

function normalizeRepeater(repeater) {
	let normalized = {state: false, except: []};

	if (repeater && typeof repeater === "object") {
		assign(normalized, repeater, {state: typeof repeater.state === "boolean" ? repeater.state : true});
	}
	else {
		normalized.state = typeof repeater === "boolean" ? repeater : false;
	}

	// normalize exceptions
	normalized.except = normalized.except.map(exception => moment(exception).format("YYYY-MM-DD"));

	return normalized;
}

function repeaterWith(repeater, ...exceptions) {
	let newRepeater = cloneObject(repeater);
	newRepeater.except = newRepeater.except.concat(exceptions.map(exception => moment(exception).format("YYYY-MM-DD")));
	return newRepeater;
}

function repeaterMap(repeater, mapper) {
	let newRepeater = cloneObject(repeater);
	newRepeater.except = newRepeater.except.map((repeater, index) => {
		return moment(mapper(repeater, index)).format("YYYY-MM-DD");
	});
	return newRepeater;
}

function repeaterTo(repeater, date) {
	return repeaterMap(repeater, exception => {
		const exceptionDate = moment(exception);
		const day = normalizeIsoDayOfWeek(date);

		return exceptionDate.startOf("isoWeek").add(day, "day");
	});
}

/* class
 -------------------------------------------------- */

class Item {

	constructor(data) {
		// Create dom
		this.dom = createItemDom();

		// Set bounds
		this.lowerBound = normalizeDate(moment(data.from));
		this.upperBound = normalizeDate(moment(data.to));

		// Set repeater
		this.repeaterModifier = normalizeRepeater(data.repeater);

		// Set data
		this.data = pluckKeysExcept(data, ["from", "to", "repeats"]);
	}

	get from() {
		return this.lowerBound.clone();
	}

	get to() {
		return this.upperBound.clone();
	}

	set from(value) {
		this.lowerBound = normalizeDate(value);
	}

	set to(value) {
		this.upperBound = normalizeDate(value);
	}

	get repeater() {
		return this.repeaterModifier;
	}

	set repeater(value) {
		this.repeaterModifier = normalizeRepeater(value);
	}

	get repeats() {
		return this.repeaterModifier.state;
	}

	set repeats(state) {
		this.repeaterModifier.state = state;
	}

	repeatsOn(week) {
		const isoDay = normalizeIsoDayOfWeek(this.from);

		return this.repeats &&
			(this.repeater.except.indexOf(week.clone().startOf("isoWeek").add(isoDay, "day").format("YYYY-MM-DD")) === -1);
	}

	weekFrom(week) {
		const from = this.from;
		const isoDay = normalizeIsoDayOfWeek(from);

		return week.clone().startOf("isoWeek")
			.add(isoDay, "day")
			.hour(from.hour())
			.minute(from.minute())
			.second(from.second());
	}

	weekTo(week) {
		const to = this.to;
		const isoDay = normalizeIsoDayOfWeek(to);

		// If ends monday at 0:00 (sunday at 23:59)
		if (isoDay === 0) {
			const startOfNextWeek = week.clone().add(1, "week").startOf("isoWeek");

			if (to.isSame(startOfNextWeek)) {
				return startOfNextWeek;
			}
		}

		return week.clone().startOf("isoWeek")
			.add(isoDay, "day")
			.hour(to.hour())
			.minute(to.minute())
			.second(to.second());
	}

	clone(data = {}) {
		return new Item(assign(
			{
				from: this.from, to: this.to,
				data: cloneObject(this.data), repeater: cloneObject(this.repeater)
			},
			data
		));
	}

}

module.exports = {
	Item,
	repeaterWith,
	repeaterMap,
	repeaterTo
};