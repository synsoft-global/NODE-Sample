"use strict"
// Include top level dependencies.
var express = require ('express');
var router = express.Router ();
var crypto = require('crypto');
var settings = require(__dirname + '/../config/settings.json');
module.exports = function (models){	
    var User = require ("../lib/User")(models);
    var Auth = require ("../lib/Auth")(models);    
	
	// register route
    router.post ('/register', function (req,res){
        Auth.register (req.body, function (data) {
            res.status (data.code).json (data);
        });
    });
	// post route for login
    router.post ("/login", function (req, res){
        Auth.adminLogin (req.body, function (data) {
            res.status (data.code).json (data);
        });
    });
	// route for verify token
    router.post("/token", (req, res) => {
        Auth.checktoken (req.body).then(data => {
            res.status (data.code).json (data);
        });
    });

    return router;
}
