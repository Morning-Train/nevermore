const moment = require("moment");

function normalizeDate(date) {
	if (date == null) {
		return null;
	}

	return moment(date).millisecond(0);
}

function normalizeIsoDayOfWeek(day) {
	day = typeof day === "number" ? day : day.day();

	if (day < 0) {
		day += 7;
	}

	if (day > 6) {
		day -= 7;
	}

	return day > 0 ? day - 1 : (6 + day);
}

function inInterval(needle, lowerBound, upperBound) {
	if (lowerBound && lowerBound.isAfter(needle)) {
		return false;
	}

	if (upperBound && upperBound.isBefore(needle)) {
		return false;
	}

	return true;
}

function inIsoWeek(needle, haystack) {
	return inInterval(needle, haystack.clone().startOf("isoWeek"), haystack.clone().add(1, "week").startOf("isoWeek"));
}

function extrapolateDate(date, min, max, unit) {
	return date.diff(min, unit) / max.diff(min, unit);
}

function interpolateDate(ratio, min, max) {
	return min.clone().add(max.diff(min) * ratio);
}

function firstIsoWeekOfMonth(dateMoment) {
	const start = dateMoment.clone().startOf("month").startOf("isoWeek");
	return dateMoment.month() === start.month() ? start : start.add(1, "week");
}

function boundDateWithin(date, lowerBound, upperBound) {
	if (lowerBound && date.isBefore(lowerBound)) {
		return lowerBound.clone();
	}

	if (upperBound && date.isAfter(upperBound)) {
		return upperBound.clone();
	}

	return date;
}

function onSameYear(moment1, moment2) {
	return moment1.year() === moment2.year();
}

function onSameMonth(moment1, moment2) {
	return onSameYear(moment1, moment2) && (moment1.month() === moment2.month());
}

function onSameDate(moment1, moment2) {
	return onSameMonth(moment1, moment2) && (moment1.date() === moment2.date());
}

function onSameIsoWeek(moment1, moment2) {
	return onSameMonth(moment1, moment2) && (moment1.isoWeek() === moment2.isoWeek());
}

function onSameIsoMonth(moment1, moment2) {
	return inInterval(
		moment2,
		firstIsoWeekOfMonth(moment1),
		firstIsoWeekOfMonth(moment1.clone().add(1, "month")).subtract(1, "day").endOf("day")
	);
}

function copyTime(target, source) {
	return target.hour(source.hour()).minute(source.minute()).second(source.second()).millisecond(source.millisecond());
}

function dateMin(...dates) {
	let min;

	dates.forEach(date => {
		if ((min == null) || date.isBefore(min)) {
			min = date.clone();
		}
	});

	return min;
}

function dateMax(...dates) {
	let max;

	dates.forEach(date => {
		if ((max == null) || date.isAfter(max)) {
			max = date.clone();
		}
	});

	return max;
}

module.exports = {
	normalizeDate,
	inIsoWeek,
	inInterval,
	extrapolateDate,
	normalizeIsoDayOfWeek,
	firstIsoWeekOfMonth,
	onSameDate,
	onSameIsoWeek,
	onSameMonth,
	onSameYear,
	onSameIsoMonth,
	boundDateWithin,
	interpolateDate,
	dateMin,
	dateMax,
	copyTime
};