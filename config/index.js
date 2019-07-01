var _ = require("lodash");
var pjson = require("../package.json");
process.env.APP_VERSION = pjson.version;
process.env.MODULE_NAME = pjson.name;
var gutil = require("gulp-util");
var path = require("path");
var env = require("node-env-file");
/**
 * @module config
 * @desc This module provides a unified configuration object where application-level settings can be stored. Properties that are safe to expose in compiled JavaScript should be stored or calculated in the [public.js]{@link module:config/public}. Settings that you would not want exposed in compiled JavaScript should be stored or calculated in [private.js]{@link module:config/private}. The [Gulp]{@link https://github.com/gulpjs/gulp} tasks included in this package use [Envify]{@link https://github.com/hughsk/envify} and [Uglifyify]{@link https://github.com/hughsk/uglifyify} transforms to strip the private code from the [Browserify]{@link https://github.com/substack/node-browserify} bundle by injecting an enviornmental variable <code>BROWSERIFY</code> with the value of <code>true</code> via Envify.


 */
var config = require("./public");
_.merge(config, require("./config.json")[config.env]);

if (!process.env.BROWSERIFY) {
	_.merge(config, require("./private"));
}

gutil.log("[VARS] Loaded " + config.env + " enviornment variables");

module.exports = config;
