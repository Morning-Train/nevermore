const {isIe} = require("./browser");

// Snapshot class
// - metrics and style based getters
// ---------------------------------

class Snapshot {

	constructor(element) {
		this.computedStyle = getComputedStyle(element);
	}

	get width() {
		// Note:
		// In IE the width is returned without the padding and the border
		// while in other browsers this feature returns the whole
		// width of the element
		let width = parseInt(this.computedStyle.width);

		if (browser.ie()) {
			width += this.borderLeftWidth +
				this.borderRightWidth +
				this.paddingLeft +
				this.paddingRight;
		}

		return width;
	}

	get height() {
		return parseInt(this.computedStyle.height);
	}

	get paddingTop() {
		return parseInt(this.computedStyle.paddingTop);
	}

	get paddingRight() {
		return parseInt(this.computedStyle.paddingRight);
	}

	get paddingBottom() {
		return parseInt(this.computedStyle.paddingBottom);
	}

	get paddingLeft() {
		return parseInt(this.computedStyle.paddingLeft);
	}

	get borderTopWidth() {
		return parseInt(this.computedStyle.borderTopWidth);
	}

	get borderRightWidth() {
		return parseInt(this.computedStyle.borderRightWidth);
	}

	get borderBottomWidth() {
		return parseInt(this.computedStyle.borderBottomWidth);
	}

	get borderLeftWidth() {
		return parseInt(this.computedStyle.borderLeftWidth);
	}

	get innerWidth() {
		return this.width - this.paddingLeft - this.paddingRight - this.borderLeftWidth - this.borderRightWidth;
	}

	get innerHeight() {
		return this.height - this.paddingTop - this.paddingBottom - this.borderTopWidth - this.borderBottomWidth;
	}

}

function snapshot(element) {
	return new Snapshot(element);
}

// Creates element from string
function createElement(elementString) {
	const wrapper = document.createElement("div");
	wrapper.innerHTML = elementString;

	const element = wrapper.firstChild;
	wrapper.removeChild(element);

	return element;
}

function parent(element, selector) {
	const parent = element.parentElement;

	if (parent == null) {
		return;
	}

	let currentParent = parent;
	let currentScope = currentParent.parentElement;

	while (
		currentScope &&
		(Array.from(currentScope.querySelectorAll(`:scope > ${selector}`)).indexOf(currentParent) === -1)
		) {
		currentParent = currentScope;
		currentScope = currentParent.parentElement;
	}

	return currentScope ? currentParent : null;
}

function appendTo(parentElement, element) {
	parentElement.appendChild(element);
	return element;
}

function append(parentElement, element) {
	appendTo(parentElement, element);
	return parentElement;
}

function removeElement(element) {
	if (element.parentElement) {
		element.parentElement.removeChild(element);
	}

	return element;
}

function empty(element) {
	element.innerHTML = "";
	return element;
}

function is(element, selector) {
	if (element.parentElement == null) {
		return false;	// TODO: Add element to temporary parent before executing the check
	}

	return Array.from(element.parentElement.querySelectorAll(`:scope > ${selector}`)).indexOf(element) !== -1;
}

function hasClass(element, className) {
	const classList = className.split(" ");
	const elementClassList = element.className.split(" ");

	for (let i = 0; i < classList.length; i++) {
		if (elementClassList.indexOf(classList[i]) === -1) {
			return false;
		}
	}

	return true;
}

function addClass(element, className) {
	let elementClassList = element.className.split(" ");
	let classList = className.split(" ");
	let index;

	for (let i = 0; i < classList.length; i++) {
		index = elementClassList.indexOf(classList[i]);

		if (index === -1) {
			elementClassList.push(classList[i]);
		}
	}

	element.className = elementClassList.join(" ");

	return element;
}

function removeClass(element, className) {
	let elementClassList = element.className.split(" ");
	let classList = className.split(" ");
	let index;

	for (let i = 0; i < classList.length; i++) {
		index = elementClassList.indexOf(classList[i]);

		if (index > -1) {
			elementClassList.splice(index, 1);
		}
	}

	element.className = elementClassList.join(" ");

	return element;
}

function toggleClass(element, className) {
	let elementClassList = element.className.split(" ");
	let classList = className.split(" ");
	let index;

	for (let i = 0; i < classList.length; i++) {
		index = elementClassList.indexOf(classList[i]);

		if (index === -1) {
			elementClassList.push(classList[i]);
		}
		else {
			elementClassList.splice(index, 1);
		}
	}

	element.className = elementClassList.join(" ");

	return element;
}

function setClass(element, className, state = true) {
	if (typeof className === "object") {
		Object.keys(className).forEach(key => {
			setClass(element, key, className[key]);
		});

		return element;
	}

	return state ? addClass(element, className) : removeClass(element, className);
}

function orphan(element) {
	return element.parentElement == null;
}

/////////////////////////////////
// Exports
/////////////////////////////////

module.exports = {
	snapshot,
	createElement,
	parent,
	append,
	appendTo,
	removeElement,
	empty,
	orphan,
	is,
	addClass,
	hasClass,
	removeClass,
	toggleClass,
	setClass,
};