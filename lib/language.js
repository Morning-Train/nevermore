// Default language
const defaultLanguage = {
	previousMonth: "",
	nextMonth: "",
	allWeeks: "All weeks",
	month: (dateMoment) => dateMoment.format("MMMM YYYY"),
	setWeek: (dateMoment) => `Week ${dateMoment.isoWeek()}`,
	day: (dateMoment) => dateMoment.format("dddd"),
	isoWeek: (dateMoment) => `Week ${dateMoment.isoWeek()}`,
	date: (dateMoment) => dateMoment.format("DD MMMM"),
	hour: (dateMoment) => dateMoment.format("HH:mm"),
	repeater: (dateMoment) => `Rep. every ${dateMoment.format("ddd")}`,
	dayDate: (dateMoment) => dateMoment.format("ddd. DD MMM")
};

module.exports = {
	defaultLanguage
};