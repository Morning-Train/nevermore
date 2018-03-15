const assign = require("object-assign");
const {toPromise} = require("cleopatra");
const {repeaterWith} = require("./../item");
const {inIsoWeek, normalizeIsoDayOfWeek} = require("./../date");

/* private
 -------------------------------------------------- */

function getItemFrom(item, refDate) {
	return item.repeats ? item.weekFrom(refDate) : item.from;
}

function getItemTo(item, refDate) {
	return item.repeats ? item.weekTo(refDate) : item.to;
}

function itemsOverlap(item, sibling, week) {
	const itemFrom = getItemFrom(item, week);
	const itemTo = getItemTo(item, week);

	const siblingFrom = getItemFrom(sibling, week);
	const siblingTo = getItemTo(sibling, week);

	return (
		(itemTo.isAfter(siblingFrom) && itemFrom.isBefore(siblingTo)) ||
		(siblingTo.isAfter(itemFrom) && siblingFrom.isBefore(itemTo)) ||
		(itemFrom.isSame(siblingFrom) && itemTo.isSame(siblingTo))
	);
}

function strictCollisionFilter(container, item, simulatedItem) {
	const date = container.getDate();
	let sibling;

	for (let i = 0; i < container.items.length; i++) {
		sibling = container.items[i];

		// skip self
		if (item === sibling) {
			continue;
		}

		if (sibling.onWeek(getItemFrom(item, date)) && itemsOverlap(simulatedItem, sibling, date)) {
			return false;
		}
	}
}

function replaceCollisionFilter(container, item, simulatedItem, itemFilter) {
	const date = container.getDate();
	let sibling;

	for (let i = 0; i < container.items.length; i++) {
		sibling = container.items[i];

		// skip self
		if (item === sibling) {
			continue;
		}

		if (sibling.onWeek(getItemFrom(item, date)) && itemsOverlap(simulatedItem, sibling, date)) {
			if (typeof itemFilter === "function" && itemFilter(sibling) === false) {
				return false;
			}

			return sibling.repeats ?
				container.updateItem(sibling, {
					repeater: repeaterWith(sibling.repeater, sibling.weekFrom(date))
				}) :
				container.removeItem(sibling);
		}
	}
}

/* class
 -------------------------------------------------- */

class CollisionDetection {

	constructor(container) {

		// Hook into container
		const handleMiddleware = payload => {
			const {item, ...options} = payload;
			const handle = this.handleCollisions(container, item, options);

			return toPromise(handle).then(() => {
				return payload;
			});
		};

		const preventMountMiddleware = payload => {
			// skip if not repeater
			if (!payload.item.repeats) {
				return;
			}

			const handle = this.preventRepeaterCollisions(container, payload.item, payload.item);

			return toPromise(handle).then(() => {
				return payload;
			});
		};

		const preventChangeMiddleware = payload => {
			// skip if not repeater
			if (!payload.item.repeats) {
				return;
			}

			const cloneItem = payload.item.clone(payload.changes);
			const handle = this.preventRepeaterCollisions(container, payload.item, cloneItem);

			return toPromise(handle).then(() => {
				// update changes
				payload.changes.repeater = cloneItem.repeater;

				return payload;
			});
		};

		container.onItemMount.through(preventMountMiddleware);
		container.onItemChange.through(preventChangeMiddleware);

		container.onItemMount.through(handleMiddleware);
		container.onItemChange.through(handleMiddleware);
		container.onItemAdd.defer(handleMiddleware);
	}

	handleCollisions(container, item, {changes, collisionFilter}) {
		const simulatedItem = item.clone(changes || {});

		switch (collisionFilter || container.options.collisionFilter) {
			case "strict":
			case true:
				return strictCollisionFilter(container, item, simulatedItem);

			case "replace":
				return replaceCollisionFilter(container, item, simulatedItem);

			case "replaceRepeater":
				return replaceCollisionFilter(container, item, simulatedItem, item => item.repeats);
		}
	}

	preventRepeaterCollisions(container, item, simulatedItem) {
		let sibling;

		for (let i = 0; i < container.items.length; i++) {
			sibling = container.items[i];

			if (sibling === item) {
				continue;
			}

			// Fail if two repeaters on same day and overlapping
			if (sibling.repeats &&
				(normalizeIsoDayOfWeek(sibling.from) === normalizeIsoDayOfWeek(simulatedItem.from)) &&
				simulatedItem.repeatsOn(sibling.from) &&
				itemsOverlap(simulatedItem, sibling, sibling.from)
			) {
				return false;
			}

			// Add exception if colliding with a normal entry
			if (itemsOverlap(simulatedItem, sibling, sibling.from)) {
				simulatedItem.repeater = repeaterWith(simulatedItem.repeater, sibling.from);
			}
		}
	}

}

module.exports = CollisionDetection;