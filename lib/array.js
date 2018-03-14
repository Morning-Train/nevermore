function spawnArray(length, generator) {
	const array = [];
	let i = 0;

	while (i < length) {
		array.push(typeof generator === "function" ? generator(i) : null);
		i++;
	}

	return array;
}

module.exports = {
	spawnArray
};