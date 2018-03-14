const assign = require("object-assign");
const {toPromise} = require("cleopatra");
const {repeaterWith} = require("./../item");
const {inInterval} = require("./../date");

/* private
 -------------------------------------------------- */

function strictDurationFilter(item, min, max) {
	const diff = item.to.diff(item.from, "minutes");

	if ((diff < min) || (diff > max)) {
		return false;
	}
}

function resizeDurationFilter(item, min, max, property) {
	const diff = item.to.diff(item.from, "minutes");

	if (diff < min) {
		item[property] = item[property].add(min - diff, "minutes");
		return;
	}

	if (diff > max) {
		item[property] = item[property].add(max - diff, "minutes");
		return;
	}
}

/* class
 -------------------------------------------------- */

class DurationLimit {

	constructor(container) {
		// Hook into container
		const mountMiddleware = (opts = {}) => {
			return payload => {
				const {item, ...options} = payload;
				const handle = this.handle(container, item, assign({}, options, opts));

				return toPromise(handle).then(() => {
					return payload;
				});
			};
		};

		const changeMiddleware = (opts = {}) => {
			return payload => {
				if (payload.changes.from || payload.changes.to) {
					const {item, changes, ...options} = payload;
					const cloneItem = item.clone(changes);
					const handle = this.handle(container, cloneItem, assign({}, options, opts));

					return toPromise(handle).then(() => {
						payload.changes.from = cloneItem.from;
						payload.changes.to = cloneItem.to;

						return payload;
					});
				}
			};
		};

		// Pair of one eager and one deferred to intercept changes before and after changes
		// from other plugins

		container.onItemMount.eager(mountMiddleware());
		container.onItemMount.defer(mountMiddleware({durationFilter: true}));

		container.onItemChange.eager(changeMiddleware());
		container.onItemChange.defer(changeMiddleware({durationFilter: true}));
	}

	handle(container, item, {durationFilter}) {
		switch (durationFilter) {
			case "resizeFrom":
				return resizeDurationFilter(item, container.options.minDuration, container.options.maxDuration, "from");

			case "resizeTo":
				return resizeDurationFilter(item, container.options.minDuration, container.options.maxDuration, "to");

			case false:
				return;

			case true:
			default:
				return strictDurationFilter(item, container.options.minDuration, container.options.maxDuration);
		}
	}


}

module.exports = DurationLimit;