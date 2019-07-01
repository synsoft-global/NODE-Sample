/*
* Objective : This will create a complete database from the using sequilize models.
* At first run it create a all tables(from models) in the db
*  At every next sync it will create a backup copy and the syn database from new changes in model.
*/

// Include top dependenciy
#!/usr/bin/env node
var config = require("../config");
var env = "test";
var models = require("../models")(env);
var md5 = require ('md5');
var fs = require('fs');
var backupDir = __dirname + '/../db-backup';
var mysqlDump = require('mysqldump');
var dbconfig = require(__dirname + '/../config/config.json')[config.env || "live"];

/* Backup database before */
if (!fs.existsSync(backupDir)) {
	fs.mkdirSync(backupDir);
}

var datetime = new Date();
var backupFile = backupDir + '/' + datetime.toISOString().slice(0,19).replace(/T|-|:/g,"") + '.sql';
// Create a dump of old database
// write it in a files
mysqlDump({
    host: dbconfig.host,
    user: dbconfig.username,
    password: dbconfig.password,
    database: dbconfig.database,
    dest: backupFile
}, function(err){
	if(err){
		console.log(err);
	}else{
		// Forcefully write new changes to db. It will auto detect model changes and sync.
		models.sequelize.sync({force: true}).then(function () {
		    models.Admin.create ({
		        email: "admin@test.com",
		        password: md5 ("admin1234"),
				role: 1
		    }).then (function (admin){
		        console.log ("Sync Database.");
		    }).catch (function (err){
		        console.log ("No admin added.");
		    });
			//console.log ("Sync Database.");
		});
	}
});
