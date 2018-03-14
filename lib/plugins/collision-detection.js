const assign = require("object-assign");
const {toPromise} = require("cleopatra");
const {repeaterWith} = require("./../item");

/* private
 -------------------------------------------------- */

function itemsOverlap(item, sibling, week) {
	const itemFrom = item.weekFrom(week);
	const itemTo = item.weekTo(week);

	const siblingFrom = sibling.weekFrom(week);
	const siblingTo = sibling.weekTo(week);

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

		if (itemsOverlap(simulatedItem, sibling, date)) {
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

		if (itemsOverlap(simulatedItem, sibling, date)) {
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
		const middleware = payload => {
			const {item, ...options} = payload;
			const handle = this.handleCollisions(container, item, options);

			return toPromise(handle).then(() => {
				return payload;
			});
		};

		container.onItemMount.through(middleware);
		container.onItemChange.through(middleware);
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


}

module.exports = CollisionDetection;