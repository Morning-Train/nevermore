// Default set of plugins
const defaultPlugins = [].concat(require("./build/options").defaultOptions.plugins);

const BoundaryDetection = require("./build/plugins/boundary-detection");
const CollisionDetection = require("./build/plugins/collision-detection");
const DurationLimit = require("./build/plugins/duration-limit");
const TimeSnap = require("./build/plugins/time-snap");
const DragCreate = require("./build/plugins/drag-create");
const DragCopy = require("./build/plugins/drag-copy");
const DragMove = require("./build/plugins/drag-move");
const MonthControl = require("./build/plugins/month-control");
const WeekControl = require("./build/plugins/week-control");

module.exports = {
	defaultPlugins: defaultPlugins,
	BoundaryDetection: BoundaryDetection,
	CollisionDetection: CollisionDetection,
	DurationLimit: DurationLimit,
	TimeSnap: TimeSnap,
	DragCreate: DragCreate,
	DragCopy: DragCopy,
	DragMove: DragMove,
	MonthControl: MonthControl,
	WeekControl: WeekControl
};
