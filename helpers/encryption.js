//Include top level dependencies
var crypto = require('crypto');
// define constants
var algorithm = 'aes-256-ctr';
var password = 'ab24@da920kd';
// exportable functions
module.exports = {
	/*
	* Objective: This will be used for encryption
	* Params: string 
	* Returns: Encrypted String.
	*/
    encrypt : function (encryptString){
        var cipher = crypto.createCipher (algorithm, password)
        var crypted = cipher.update (encryptString, 'utf8', 'hex')
        crypted += cipher.final ('hex');
        return crypted;
    }
};
