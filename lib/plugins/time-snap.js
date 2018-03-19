/* private
 -------------------------------------------------- */

function snapDate(date, startDate, snapDuration, unit = "minutes") {
	const duration = date.diff(startDate, unit);
	return startDate.clone().add(Math.floor(duration / snapDuration) * snapDuration, unit);
}

/* class
 -------------------------------------------------- */

class TimeSnap {

	constructor(container) {
		// Hook into container
		const mountMiddleware = payload => {
			this.handle(container, payload.item, container.options.snap);
		};

		const changeMiddleware = payload => {
			if (payload.changes.from || payload.changes.to) {
				const item = payload.item.clone(payload.changes);
				this.handle(container, item);

				payload.changes.from = item.from;
				payload.changes.to = item.to;
			}
		};

		container.onItemMount.eager(mountMiddleware);
		container.onItemAdd.defer(mountMiddleware);
		container.onItemChange.eager(changeMiddleware);
	}

	handle(container, item) {
		const start = item.from.startOf("day").add(container.options.minTime, "hour");
		const duration = container.options.snap;

		if (typeof duration === "number") {
			item.from = snapDate(item.from, start, duration);
			item.to = snapDate(item.to, start, duration);
		}
	}


}

module.exports = TimeSnap;