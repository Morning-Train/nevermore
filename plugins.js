// Default set of plugins
const defaultPlugins = [].concat(require("./lib/options").defaultOptions.plugins);

const BoundaryDetection = require("./lib/plugins/boundary-detection");
const CollisionDetection = require("./lib/plugins/collision-detection");
const DurationLimit = require("./lib/plugins/duration-limit");
const TimeSnap = require("./lib/plugins/time-snap");
const DragCreate = require("./lib/plugins/drag-create");
const DragCopy = require("./lib/plugins/drag-copy");
const DragMove = require("./lib/plugins/drag-move");
const MonthControl = require("./lib/plugins/month-control");
const WeekControl = require("./lib/plugins/week-control");

module.exports = {
	defaultPlugins,
	BoundaryDetection,
	CollisionDetection,
	DurationLimit,
	TimeSnap,
	DragCreate,
	DragCopy,
	DragMove,
	MonthControl,
	WeekControl
};
