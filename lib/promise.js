const Promise = require("es6-promise");

function awaitPromises(...promises) {
	return new Promise((resolve) => {
		let pending = promises.length;
		const check = () => {
			pending--;

			if (pending === 0) {
				resolve();
			}
		};

		promises.forEach(promise => {
			promise.then(check).catch(check);
		});
	});
}

module.exports = {
	awaitPromises
};