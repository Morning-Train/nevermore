function interpolate(ratio, min, max) {
	return min + (max - min) * ratio;
}

function extrapolate(value, min, max) {
	return (value - min) / (max - min);
}

function toBounds(value, min, max) {
	if (min && (value < min)) {
		return min;
	}

	if (max && (value > max)) {
		return max;
	}
}

function getFraction(value) {
	return value - Math.floor(value);
}

module.exports = {
	interpolate,
	extrapolate,
	toBounds,
	getFraction
};
