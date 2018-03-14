const moment = require("moment");
const assign = require("object-assign");
const ee = require("event-emitter");
const {createElement, appendTo, addClass} = require("./dom");
const {createPipeline} = require("cleopatra");
const {defaultOptions} = require("./options");
const {defaultLanguage} = require("./language");
const {normalizeDate, boundDateWithin} = require("./date");
const {Item} = require("./item");
const {pluckKeys} = require("./object");

const TableHeader = require("./components/table-header");
const TableGrid = require("./components/table-grid");
const TableBody = require("./components/table-body");
const TimeScale = require("./components/time-scale");
const ItemDescription = require("./components/item-description");

/* private
 -------------------------------------------------- */

function makePipeline() {
	return createPipeline().report(error => {
		if (error instanceof Error) {
			console.error(error);
		}
	});
}

function createContainerDom(element) {
	addClass(element, "nvm-container");

	appendTo(element, createElement('<div class="nvm-controls"></div>'));
	appendTo(element, createElement('<div class="nvm-header"></div>'));
	appendTo(element, createElement('<div class="nvm-body"></div>'));
	appendTo(element, createElement('<div class="nvm-footer"></div>'));

	return element;
}

/* class
 -------------------------------------------------- */

class Container {

	/////////////////////////////////
	// Constructor
	/////////////////////////////////

	constructor(element, options = {}) {
		// Bind methods to container for unscoped usage
		this.getDate = this.getDate.bind(this);
		this.setDate = this.setDate.bind(this);
		this.addItem = this.addItem.bind(this);
		this.removeItem = this.removeItem.bind(this);
		this.updateItem = this.updateItem.bind(this);
		this.lang = this.lang.bind(this);

		// Set options
		this.options = assign({}, defaultOptions, options);

		// Set language
		this.language = assign({}, defaultLanguage, options.language || {});

		// Set dom
		this.dom = createContainerDom(element);

		// Normalize min & max date
		if (this.options.minDate) {
			this.options.minDate = normalizeDate(this.options.minDate).startOf("day");
		}

		if (this.options.maxDate) {
			this.options.maxDate = normalizeDate(this.options.maxDate).endOf("day");
		}

		// Set initial date
		this.date = boundDateWithin(
			normalizeDate(options.date ? moment(this.options.date) : moment()),
			this.options.minDate,
			this.options.maxDate
		);

		// Set initial items
		this.items = [];

		// Create pipelines
		this.onDateChange = makePipeline();
		this.onItemAdd = makePipeline();
		this.onItemRemove = makePipeline();
		this.onItemChange = makePipeline();
		this.onItemMount = makePipeline();
		this.onItemUnmount = makePipeline();

		// Link pipelines
		this.onDateChange.to(({date, silent}) => {
			const previousDate = this.date.clone();
			this.date = boundDateWithin(date, this.options.minDate, this.options.maxDate);

			// internal event
			this.emit("dateChange", this.date, previousDate);

			// external event
			if (!silent) {
				this.emit("navigate", this.date, previousDate);
			}
		});

		this.onItemMount.to(({item, silent}) => {
			if (this.items.indexOf(item) === -1) {
				this.items.push(item);

				// internal event
				this.emit("itemMount", item);
			}
		});

		this.onItemUnmount.to(({item, silent}) => {
			const index = this.items.indexOf(item);

			if (index !== -1) {
				this.items.splice(index, 1);

				// internal event
				this.emit("itemUnmount", item);
			}
		});

		this.onItemAdd.to(payload => this.onItemMount.dispatch(payload).then(() => {
			// internal event
			this.emit("itemAdd", payload.item);

			// external event
			if (!payload.silent) {
				this.emit("add", payload.item);
			}
		}));

		this.onItemRemove.to(payload => this.onItemUnmount.dispatch(payload).then(() => {
			// internal event
			this.emit("itemRemove", payload.item);

			// external event
			if (!payload.silent) {
				this.emit("remove", payload.item);
			}
		}));

		this.onItemChange.to(({item, changes, silent}) => {
			assign(item, changes);

			// internal event
			this.emit("itemChange", item);

			// external event
			if (!silent) {
				this.emit("change", item);
			}
		});

		// Load plugins
		this.options.plugins.forEach(Plugin => new Plugin(this));

		// Load items
		this.options.items.forEach(itemData => this.mountItem(new Item(itemData)));

		// Trigger initialized
		this.emit("initialize");
	}

	/////////////////////////////////
	// Date management
	/////////////////////////////////

	getDate() {
		return this.date.clone();
	}

	setDate(date, options = {}) {
		this.onDateChange.dispatch({date, ...options});
	}

	startOfDay(date = null) {
		return (date || this.date).clone().startOf("day").add(this.options.minTime, "hour");
	}

	endOfDay(date = null) {
		return (date || this.date).clone().startOf("day").add(this.options.maxTime, "hour");
	}

	/////////////////////////////////
	// Item management
	/////////////////////////////////

	addItem(item, options = {}) {
		return this.onItemAdd.dispatch({item, ...options});
	}

	removeItem(item, options = {}) {
		return this.onItemRemove.dispatch({item, ...options});
	}

	mountItem(item, options = {}) {
		return this.onItemMount.dispatch({item, ...options});
	}

	unmountItem(item, options = {}) {
		return this.onItemUnmount.dispatch({item, ...options});
	}

	updateItem(item, changes, options = {}) {
		return this.onItemChange.dispatch({item, changes, ...options});
	}

	/////////////////////////////////
	// Language management
	/////////////////////////////////

	lang(key, ...args) {
		let resolver = this.language[key];

		if (typeof resolver === "string") {
			return resolver;
		}

		if (typeof resolver === "function") {
			return resolver(...args);
		}

		return typeof args[0] === "string" ? args[0] : key;
	}

}

/* Event emitter patch
 -------------------------------------------------- */
ee(Container.prototype);

/* Generator
 -------------------------------------------------- */
function createContainer(element, options = {}) {
	// Push default plugins (components)
	options.plugins = [
		TableHeader,
		TimeScale,
		TableGrid,
		TableBody,
		ItemDescription

	].concat(options.plugins || defaultOptions.plugins);

	return new Container(element, options);
}

module.exports = {
	createContainer,
	Container
};
