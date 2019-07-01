// Include top level dendencies
"use strict"
var mailer = require ("../helpers/mailer");
var md5 = require ("md5");
var fs = require ("fs");
var path = require ("path");
var crypto = require('crypto');
var moment = require("moment");
var _ = require("underscore");
var constants = require ("../config/constants");
// exportable functions
module.exports = function (models){
    // Include mailer module    
    var Mail = require("./Mailer")(models);
    /**
    * Objective : function will return all/single the users/user from db table.
    * Parameters: id
    * Returns : {Object/Array} Complete data of a user if id passed or array of users if no id passed.
    */
    function all (data, callback){

        var include = [];

        var where = {};
        // If id- return complete data of user belong to id
        // If id is null retur list of all the users with only subscriptions details.
        if(data.params.id){
            where.id = data.params.id;
            // Include data through sequilize from relate tables
            include = [{
                model: models.Subscription,
                required: false
            }, {
    			model: models.MenuType,
    			required: false
    	    },
    	    {
                model: models.Dietician,
                required: false
            }, {
                model: models.ContactPerson,
                required: false
            }, {
                model: models.SalesPerson,
                required: false
    		}

			];
        }else{
            include = [{
                model: models.Subscription,
                required: false
            }];
        }

        //if menu date is requested, add menu details for that date
        if (data.query.menu){

            where = {
                startingFrom: { $ne: null },
                planDuration: { $gt: 0 },
                isActive: true
            };

            var fromDate = new Date((data.query.menu ? data.query.menu : null));
            var toDate = new Date ();
            toDate.setDate (fromDate.getDate () + (data.query.days ? parseInt (data.query.days) : 1));

            include.push ({
                model: models.Menu,
                required: false,
                include: [{
                    model: models.MenuItem,
                    required: false,
                    include: [models.Dish]
                }],
                where: {
                    date: moment(data.query.menu).format("YYYY-MM-DD")
				}
            });

            include.push ({
                model: models.Delivery,
                required: false,
                where: {
                    createdAt: {
                        $between: [fromDate, toDate]
                    }
                }
            });
        }else{
            include.push({ model: models.Menu, required: false });
        }

        models.User.findAll ({
            where: where,
            include: include,
            order: "id DESC"
        }).then (function (User){
            if(data.params.id){
                if(User.length){
                    callback ({status: true, code: 200, data: User[0]});
                }else{
                    callback ({status: false, code: 404, data: "User not found."});
                }
            }else{
                callback ({status: true, code: 200, data: User});
            }
        }).catch (function (err){
            callback ({status: true, code: 400, data: err});
        });
    }

    /**
    * Objective : function will return single the user from db table.
    * Parameters: id
    * Returns : {Object/Array} Complete data of a user if id passed or array of users if no id passed.
    */

    function findById (data, callback){
        models.User.findAll ({
            where: {
                id: data.id
            },
            include: [
               {
                   model: models.Subscription,
                   required: false
               },
				{
					model: models.State,
					required: false,
					as: "WorkState"
				}
            ]
        }).then (function (User){
            callback ({status: true, code: 200, data: User});
        }).catch (function (err){
            callback ({status: true, code: 400, data: err});
        });
    }
    return {
        all: all,
        findById: findById,
        create: create
    
    };
}
