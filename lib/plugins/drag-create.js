const {dateMin, dateMax} = require("./../date");
const {Item} = require("./../item");

/* private
 -------------------------------------------------- */

const origin = "drag-create";

/* class
 -------------------------------------------------- */

class DragCreate {

	constructor(container) {
		container.once("initialize", () => {
			this.bind(container, container.dom.querySelector(".nvm-table-body"));
		});
	}

	bind(container, element) {
		// drag initial date
		let currentItem;
		let anchorDate;

		element.addEventListener("mousedown", e => {
			if (e.target === element) {
				const newAnchorDate = container.dateAtMouse(e);
				const newItem = new Item({from: newAnchorDate.clone(), to: newAnchorDate.clone()});

				container.mountItem(newItem, {durationFilter: "resizeTo", origin}).then(() => {
					currentItem = newItem;
					anchorDate = newAnchorDate;
				});
			}
		});

		window.addEventListener("mousemove", e => {
			if (currentItem) {
				let boundDate = container.dateAtMouse(e);

				// TODO: FIX THIS

				anchorDate.date(
					boundDate.date()
				);

				const from = dateMin(anchorDate, boundDate);
				const to = dateMax(anchorDate, boundDate);

				container.updateItem(currentItem, {from, to}, {
					silent: true,
					durationFilter: anchorDate.isSame(to) ? "resizeFrom" : "resizeTo",
					origin
				});
			}
		});

		window.addEventListener("mouseup", () => {
			if (currentItem) {
				const item = currentItem;

				container.addItem(item, {origin}).catch(() => {
					container.removeItem(item, {silent: true, origin});
				});

				currentItem = null;
				anchorDate = null;
			}
		});

	}

}

module.exports = DragCreate;