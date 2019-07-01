"use strict";

/** The name of the enviornment in which the application is executed. Can be set via the <code>NODE_ENV</code> enviornmental variable.
 * @type {string}
 * @default unknown
 */
module.exports.env = process.env.NODE_ENV_OVERRIDE || process.env.NODE_ENV || "live";

module.exports.name = process.env.MODULE_NAME || "healthco-api";
