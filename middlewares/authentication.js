/*
*This is to add validate request from authenticated vendor only. There should be valid `storeId,appId,username` with request
* It will match the combined of several params hash as requested.
*/
"use strict"
var models = require ("../models");
var md5 = require ("md5");

module.exports = function (request, response, next) {

    var errors = {
        error : false
    };
    var username = request.get ("username");
    var key = request.get ("key");
    var storeId = request.get ("storeId");
    var appId = request.get ("appId");

    var _debug = {
        username: username,
        key: key,
        storeId: storeId,
        appId: appId
    };

    console.log (_debug);

    if (username == null || username == "" || key == null || key == "" || storeId == null || storeId == "" || appId == null || appId == ""){
		var resp = {
			status : false,
			message : "Authentication failed. Make sure that you are sending all Authentication parameters."
		};
        response.status (401).json (resp);
		return;
	}

    models.AppKey.findOne ({
        where : {
            appId : appId
        }
    }).then (function (AppKey) {
        if (!AppKey) {
            var resp = {
                status : false,
                message : "Authentication failed. Make sure that you are sending all Authentication parameters.",
                errors: {
                    appKey: "Invalid AppKey is provided."
                }
            };
            response.status (401).json (resp);
            return;
        }

        models.User.findOne ({
            where: {
                email : username
            }
        }).then (function (User) {

            if (User) {
                var hashKey = md5 (User.email + User.id + User.pinCode + storeId + AppKey.appKey);

                if (hashKey === key) {
                    next ();
                    return;
                }
            }
            var resp = {
                status : false,
                message : "Authentication failed. Make sure that you are sending all Authentication parameters.",
                errors: {
                    key: "Invalid key is provided."
                }
            };
            response.status (401).json (resp);
            return;
        });
   });
};
