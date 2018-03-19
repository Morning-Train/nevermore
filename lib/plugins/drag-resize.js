const {createElement, appendTo} = require("./../dom");

/* private
 -------------------------------------------------- */

const origin = "drag-resize";

function createDom(parentElement) {
	appendTo(
		parentElement,
		createElement(
			`<div class="nvm-grabber nvm-grabber-top"></div>`
		)
	);

	appendTo(
		parentElement,
		createElement(
			`<div class="nvm-grabber nvm-grabber-bottom"></div>`
		)
	);

	return parentElement;
}

/* class
 -------------------------------------------------- */

class DragResize {

	constructor(container) {
		// Initialize when item is mount
		container.on("itemMount", item => {
			this.createItemDom(container, item);
			this.bindItem(container, item);
		});
	}

	createItemDom(container, item) {
		createDom(item.dom.querySelector(".nvm-item-controls"));
	}

	bindItem(container, item) {
		let direction;

		item.dom.querySelector(".nvm-grabber-top").addEventListener("mousedown", () => {
			direction = -1;
		});

		item.dom.querySelector(".nvm-grabber-bottom").addEventListener("mousedown", () => {
			direction = 1;
		});

		window.addEventListener("mouseup", () => {
			direction = null;
		});

		window.addEventListener("mousemove", e => {
			if (direction != null) {
				const date = container.dateAtMouse(e);
				const changes = direction > 0 ? {to: date} : {from: date};

				container.updateItem(item, changes, {origin});
			}
		});
	}

}

module.exports = DragResize;