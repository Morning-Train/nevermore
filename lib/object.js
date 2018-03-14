/**
 * Query an object for a specific key
 *
 * @param object
 * @param query
 * @param defaults
 * @returns {*}
 */
function queryObject(object, query, defaults = null) {
	let current = object;
	let queryParts = query.split(".");
	let part;

	if (object == undefined) {
		return defaults;
	}

	while (current && (queryParts.length > 0)) {
		part = queryParts.shift();

		if (current[part] == undefined) {
			return defaults;
		}

		current = current[part];
	}

	return current;
}

function setValueByQuery(object, query, value) {
	let parts = query.split(".");
	let key = parts.pop();
	let parentQuery = parts.join(".");
	let parent = parts.length === 0 ? object : queryObject(object, parentQuery);

	if (parent == undefined) {
		setValueByQuery(object, parentQuery, (parent = {}));
	}

	parent[key] = value;

	return object;
}

/**
 * Pluck specific keys from an object
 *
 * @param object
 * @param keys
 * @returns {{}}
 */
function pluckKeys(object, keys) {
	let newObj = {};

	keys.forEach(key => {
		if (key in object) {
			newObj[key] = object[key]
		}
	});
	return newObj;
}

/**
 * Pluck keys except specific from an object
 *
 * @param object
 * @param exceptions
 * @returns {{}}
 */
function pluckKeysExcept(object, exceptions) {
	let keys = Object.keys(object);

	exceptions.forEach(key => {
		let index = keys.indexOf(key);

		if (index !== -1) {
			keys.splice(index, 1);
		}
	});

	return pluckKeys(object, keys);
}

function cloneObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}

module.exports = {
	queryObject,
	setValueByQuery,
	pluckKeys,
	pluckKeysExcept,
	cloneObject
};