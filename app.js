"use strict"
// Include top level dependencies
var express = require ('express');
var logger = require ('morgan');
var bodyParser = require ('body-parser');
var app = express ();
var config = require("./config");
var schedule = require('node-schedule');
var env = config.env || "test";
var routes = require ("./routes")(env);
var Cron = require ("./lib/Cron")(env);
var path = require('path');

app.use (bodyParser.json ({limit: '50mb'}));
// load bower components as per need
app.use('/bower_components',  express.static(path.join(__dirname, '../bower_components')));
app.use (bodyParser.urlencoded ({ extended: false, limit: '50mb' }));

/*
	Allow cross origin applications.
*/
app.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'userId, X-TtainiumId, xid, X-Requested-With, content-type, token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use ('/auth', routes.Auth);
app.use ('/users', routes.User);

//Cron.execute();

module.exports = app;
