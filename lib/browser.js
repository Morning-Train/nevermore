const {detect} = require("detect-browser");

// Cache detection
let detection;

function getDetection() {
	return detection || (detection = detect());
}

function isIe() {
	return getDetection().name === "ie";
}

module.exports = {
	getDetection,
	isIe
};