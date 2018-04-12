const moment = require("moment");
const {createContainer} = require("./container");

module.exports = createContainer;
module.exports.moment = function (callback) {
	if (typeof callback === "function") {
		callback(moment);
	}

	return moment;
};