const MonthControl = require("./plugins/month-control");
const WeekControl = require("./plugins/week-control");
const DragCreate = require("./plugins/drag-create");
const DragMove = require("./plugins/drag-move");
const DragResize = require("./plugins/drag-resize");
const DragCopy = require("./plugins/drag-copy");
const CollisionDetection = require("./plugins/collision-detection");
const BoundaryDetection = require("./plugins/boundary-detection");
const TimeSnap = require("./plugins/time-snap");
const DurationLimit = require("./plugins/duration-limit");

// Default options
const defaultOptions = {
	// Core options
	date: null,
	minDate: null,
	maxDate: null,
	minTime: 0,
	maxTime: 24,

	// Collision options
	collisionFilter: true,

	// Snap options
	snap: 30,

	// Duration options
	minDuration: 60,
	maxDuration: 1440,

	// Drag options
	copyOverlap: 0.25,

	// Plugins
	plugins: [
		MonthControl, WeekControl,
		TimeSnap, DurationLimit,
		BoundaryDetection, CollisionDetection,
		DragCreate, DragMove, DragResize, DragCopy,

	],

	// Data
	items: []
};

module.exports = {
	defaultOptions
};