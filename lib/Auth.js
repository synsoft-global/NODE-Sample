// Include top level dependencies and modules
"use strict"
var crypto = require('crypto');
var md5 = require ('md5');
var jwt = require ('jsonwebtoken');
var mailer = require ("../helpers/mailer");
var constants = require ("../config/constants");
var fs = require ("fs");

/*
* Exported all the modules 
* It needs `models` as the input param
* `models` should contains all the models defination
*/
module.exports = function (models) {
	// include notification module
	var Notification = require ("./Notification")(models);
	// include mailer module
	var Mail = require("./Mailer")(models);
	/*
	* Objective : Register function will be used for registering user.
	*Parameters : object with required fiels `Name, Email, Phone, Password`
	* Returns failure with message or token if successful.
	* After signup user will autologin with inactive status.
	* Inactive user cannot place order but can login and review existing things.
	*/
	function register (data, callback) {
		var errors = {
			error: false
		};

	    if (!data.name || data.name == "") {
	        errors.fullName = "Name cannot be empty";
	        errors.error = true;
	    }

	    if (!data.email || data.email == "") {
	        errors.email = "Email cannot be empty";
	        errors.error = true;
	    }

	    if (!data.password || data.password == "") {
	        errors.password = "password cannot be empty";
	        errors.error = true;
	    }

	    if (!data.phone || data.phone == "") {
	        errors.phone = "Phone number cannot be empty";
	        errors.error = true;
	    }

	    if (errors.error) {
	    	callback ({status: false, code: 400, data: errors});
	    	errors.error = false;
	    }

		var token="";
		crypto.randomBytes(20, function (err, buffer) {
			token = buffer.toString('hex');
		});

		models.User.findOne ({
			where: {
				email: data.email
			}
		}).then (function (user) {

			if (user) {
				callback ({status: false, code: 409, data: "A user with the same email address already exists."});
			}else {
				data.password = md5(data.password);
				data.isActive = 0;
				data.registration_token = token;
				data.status = 'Inactive';
				models.User.create (data).then (function (user) {					
					callback ({status: true, code: 201, data: user});
				})				
			}
		}).catch (function (err) {
			console.log(err);
			callback ({status: false, code: 400, data: err});
		});
	}

	/*
	* Objective : Login user, verify user on the basis of provided email and password.
	*Parameters : object with required fiels `Email, Password`
	* Returns failure with message or token if successful.
	* After signup user will autologin.
	*/

	function authenticate (data, callback) {

		var errors = {
			error: false
		};

		if (!data.email || data.email== "") {
	        errors.email = "Email cannot be empty.";
	        errors.error = true;
	    }

	    if (!data.password || data.password== "") {
	        errors.password = "Password cannot be empty";
	        errors.error = true;
	    }

	    if (errors.error) {
	    	callback ({status: false, code: 400, data: "Invalid email or password provided."});
	    	errors.error =false;
	    }

		models.User.findOne ({
			where: {
				email: data.email,
				password: md5(data.password)
			},
			include: [{
                model: models.Subscription,
                required: false
            }, {
                model: models.MenuType,
                required: false
            }]
		}).then (function (user) {
			if (user){
				callback ({status: true, code: 200, data: user});
			}else{
				callback ({status: false, code: 401, data: "Invalid username or password."});
			}
		}).catch (function (err) {
			callback ({ status: false, code: 500, data: err.message });
		});

	}

	return  {
		authenticate: authenticate,
		register: register
	}

}
