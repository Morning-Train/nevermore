const assign = require("object-assign");
const {toPromise} = require("cleopatra");
const {repeaterWith} = require("./../item");
const {inInterval} = require("./../date");

/* private
 -------------------------------------------------- */

/* class
 -------------------------------------------------- */

class BoundaryDetection {

	constructor(container) {
		// Hook into container
		const middleware = payload => {
			const {item, ...options} = payload;
			const handle = this.handle(container, item, options);

			return toPromise(handle).then(() => {
				return payload;
			});
		};

		container.onItemMount.through(middleware);
		container.onItemChange.through(middleware);
		container.onItemAdd.defer(middleware);

		const dayMountMiddleware = payload => {
			this.boundToDay(container, payload.item);
		};

		const dayChangeMiddleware = payload => {
			const cloneItem = payload.item.clone(payload.changes);
			this.boundToDay(container, cloneItem);

			payload.changes.to = cloneItem.to;
			console.log("set to", payload.item.to.format("DD.MM HH:mm"), payload.changes.to.format("DD.MM HH:mm"));
		};

		//container.onItemMount.eager(dayMountMiddleware);
		//container.onItemChange.eager(dayChangeMiddleware);
	}

	handle(container, item, {changes}) {
		const simulatedItem = item.clone(changes || {});
		const date = container.getDate();
		const from = simulatedItem.weekFrom(date);
		const to = simulatedItem.weekTo(date);
		const start = from.clone().startOf("day").add(container.options.minTime, "hour");
		const end = from.clone().startOf("day").add(container.options.maxTime, "hour");

		if (!inInterval(from, start, end) || !inInterval(to, start, end)) {
			return false;
		}
	}

	boundToDay(container, item) {
		const endOfDay = item.from.endOf("day");

		if (item.to.isAfter(endOfDay)) {
			item.to = endOfDay;
		}
	}

}

module.exports = BoundaryDetection;