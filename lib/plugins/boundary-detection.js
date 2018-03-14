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


}

module.exports = BoundaryDetection;