"use strict";
// Include top level dependencies.
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var config = require("../config");

// This file is the module loader
// This will automatically loads all the files in directory it resides put them in memory.
// No need to include new models file if you create new. Just restart server, it will manage automatically.
module.exports = function (env){

    //var env = context.stage || config.env || "test";
    var dbconfig = require(__dirname + '/../config/config.json')[config.env || "live"];
    var sequelize = new Sequelize(dbconfig.database, dbconfig.username, dbconfig.password, dbconfig);
    var db = {};
    // Reading files in the lib directory
    fs
      .readdirSync(__dirname)
      .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
      })
      .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
      });

    Object.keys(db).forEach(function(modelName) {
        if ("associate" in db[modelName]) {
        db[modelName].associate(db);
        }
    });
    //returns db variable  with all specified models.
    db.sequelize = sequelize;

    return db;
}
