// include configuratin file
var config = require("../config");

/**
* Lamda function will run whenever we go with gulp initiation
* It will include all the library files from lib directory
* it will read files one by one and interpret it
*/
exports.handler = function(event, context) {

    var env = config.env || "test";

    var lib = require ("../lib")(env);
    var command = event.operation.split (".");
    var library = command[0];
    var route = command[1];

    if (lib[library] && lib[library][route]){
        lib[library][route](event.data, function (success, obj){
            if (success){
                context.succeed ({success: true, data: obj});
            }else{
                console.log (obj);
                context.fail (new Error({success: false, error: obj}));
            }
        });
    }else{
        context.fail(new Error("No Event for:" + library + "/" + route));
    }
}
