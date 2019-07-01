"use strict";

/**
 * @module config/private
 * @desc An object that sets and calculates configurations settings that can should not be exposed in public-facing compiled JavaScript.
 * @see module:config
 * @see module:config/public
 */

module.exports.aws = {
	key: process.env.AWS_ACCESS_KEY_ID,
	secret: process.env.AWS_SECRET_ACCESS_KEY,
	region: "us-east-1",
	bucket: "",
	function: "",
	role: process.env.AWS_ROLE,
	timeout: 30,
	memorySize: 128
};
