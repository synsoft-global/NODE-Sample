// Include top level dependencies.
var config = require("../config");
// This file is the module loader
// This will automatically loads all the files in directory it resides put them in memory.
// No need to include new lib file if you create new. Just restart server, it will manage automatically.
module.exports = function(env) {

     if (!env){
         env = config.env || "test";
     }

    var lib = {};
    var models = require ("../models")(env);
    var fs = require("fs");
    // Reading files in the lib directory
    fs
      .readdirSync(__dirname)
      .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
      })
      .forEach(function(file) {
          var cd = file.replace (".js", "");
          lib[cd] = require ("./" + file)(models);
      });
      //returns lib variable.
      return lib;
}
