const
	gulp = require("gulp"),
	babel = require("gulp-babel");

gulp.task("default", ["build"], () => {
});

/*
 -------------------------------
 Build with babel
 -------------------------------
 */

gulp.task("build", () => {
	return gulp.src("./lib/**/*.js")
		.pipe(babel({
			presets: [["env", {
				targets: {
					node: "4",
					browsers: ["last 2 versions", "Explorer >= 10"]
				}
			}]],
			plugins: ["transform-object-rest-spread"]
		}))
		.pipe(gulp.dest("./build"));
});