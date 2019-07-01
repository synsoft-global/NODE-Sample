"use strict"
/**
* Objective: Top level ACL - Access Control List
* It will check for the actions allowed to store. It will check what permission a user have on specified store.
* Params: StoreId, Username
* Return: Permission issue or Allowed the action user is performing
*/

var models = require ("../models");

module.exports = function (request, response, next) {

	var method = request.method;
	var route = request.baseUrl;
	var userName = request.get("username");
	var storeId = request.get ("storeId");
    var errors = {};

	console.log ("\n");
	console.log (request);
	console.log ("\n");
	console.log ("Route is "+route);
	console.log ("\n");
	console.log ("Method is "+method);
	console.log ("\n");

	if (userName == "") {
		errors.userName = "userName is missing"
		errors.error = true;
	}

	if (storeId == "") {
		errors.storeId = "storeId is missing"
		errors.error = true;
	}

	if (errors.error) {
		response.json ({
			status : false,
			message : "Information is missing.",
			errors : errors
		});
        errors.error = true
		return;
    }

	models.User.findOne ({
		where : {
			email : userName
		}
	}).then (function (User) {
		if (!User) {

			response.json ({
				status : false,
				message : "User Not found in the database."
			}, 404);
			return;
		}

		models.StoreUser.findOne ({

			where : {
				UserId : User.id,
				StoreId : storeId,
			}, include : [{
				model : models.Permission,
				where : {
				//	route : route,
				//	method : method
				}
			}]
		}).then (function (StoreUser) {
			response.json (StoreUser);
			return;


			if (!StoreUser) {

				response.json ({
					status : false,
					message : "You donot have Permission to access this method."
				}, 401);
				return;
			}


			if (StoreUser.Permission.method == "GET") {

				models.Customer.find ({
					where : {
						createdByUserId : User.id
					}
				}).then (function (Customer) {

					if (!Customer) {
						models.Customer.findOne ({

							where : {
								id : 6
							}
						}).then (function (Customer) {

							models.StoreUser.findOne ({
								where : {
									UserId : User.id,
									StoreId : 1
								}
							}).then (function (StoreUser) {

								var callingUserlevel = StoreUser.level;

								models.StoreUser.findOne ({
									where : {
										UserId : Customer.createdByUserId,
										StoreId : 1
									}

								}).then (function (StoreUser) {

									var actualUserlevel = StoreUser.level;

									if (callingUserlevel < actualUserlevel) {

										next ();
									}
									else {

										response.json ({
											status : false,
											message : "You do not have permission to modified this record"

										}, 401);
										return;
									}
								});
							});
						});

					}
					else {
						next ();
					}

				});
			}

			else if (StoreUser.Permission.method == "PUT") {

				models.Customer.find ({
					where : {
						id : 6,
						createdByUserId : User.id
					}

				}).then (function (Customer) {

					if (!Customer) {

						models.Customer.findOne ({
							where : {
								id : 6
							}
						}).then (function (Customer) {

							models.StoreUser.findOne ({
								where : {
									UserId : User.id,
									StoreId : 1
								}
							}).then (function (StoreUser) {

								var callingUserlevel = StoreUser.level;

								models.StoreUser.findOne ({
									where : {
										UserId : Customer.createdByUserId,
										StoreId : 1
									}

								}).then (function (StoreUser) {

									var actualUserlevel = StoreUser.level;

									if (callingUserlevel < actualUserlevel) {

										next ();
									}

									else {

										response.json ({
											status : false,
											message : "You do not have permission to modified this record"

										}, 401);

										return;
									}
								});
							});
						});


					}
					else {
						response.json ("User found");
						return;
					}
				});
			}

			else if (StoreUser.Permission.method == "DELETE") {

				models.Customer.find ({
					id : id,
					createdByUserId : User.id
				}).then (function (Customer) {

					if (!Customer) {

						models.Customer.findOne ({
							where : {
								id : 6
							}
						}).then (function (Customer) {

							models.StoreUser.findOne ({
								where : {
									UserId : User.id,
									StoreId : 1
								}
							}).then (function (StoreUser) {

								var callingUserlevel = StoreUser.level;

								models.StoreUser.findOne ({
									where : {
										UserId : Customer.createdByUserId,
										StoreId : 1
									}

								}).then (function (StoreUser) {

									var actualUserlevel = StoreUser.level;

									if (callingUserlevel < actualUserlevel) {
										next ();
									}
									else {

										response.json ({
											status : false,
											message : "You do not have permission to modified this record"

										}, 401);

										return;
									}
								});
							});
						});

					}
					else {
						next ();
					}

				});
			}

			else if (StoreUser.Permission.method == "POST") {
				next ();
			}

			else {
				response.json ({
					status : false,
					message : "You donot have any permission to access the system"
				}, 401);
				return;
			}
		});
	});

};
