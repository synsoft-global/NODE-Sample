"use strict"
module.exports = function (models) {
	// Include top level dependencies.
    var express = require ('express');
    var router = express.Router ();
    var fs = require ("fs");
    var path = require ("path");
    var User = require ("../lib/User")(models);
    var Notification = require ("./../lib/Notification")(models);
    var json2csv = require('json2csv');
	
	// List all the users
    router.get ('/', function (req, res) {
        User.all (req, function (data) {
            res.status (data.code).json (data);
        });
    });
   
	// update  a order delivery  with delivery boy id
    router.put ('/:userId/delivery/:deliveryBoyId', function (req, res) {
        User.updateDelivery ({
            data: {
                deliveryBoyId: req.params.deliveryBoyId
            },
            id: req.params.userId
        }, function (data) {
            res.status (data.code).json (data);
        });
    });
	
	// delete user routes
    router.delete ('/:id', function (req, res) {
        User.deleteUser ({
            id: req.params.id
        }, function (data) {
            res.status (data.code).json (data);
        })
    });

	// forgot password routes
	router.post ('/forgot', function (req, res) {
        User.forgotPassword (req.body, function (data) {
            res.status (data.code).json (data);
        });
    });   

    return router;
}
