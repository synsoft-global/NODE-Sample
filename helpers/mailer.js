// Include top level dendencies
var nodemailer = require('nodemailer');
var constants = require ("../config/constants");
var transporter = nodemailer.createTransport();
/**
* Objective: SendEmail is a function with serveral allowed options . It will overwrite image header path in html content whenever called.
Parametes: Options=>{
    to, subject, html, attachement
}
*/
exports.sendEmail = function (options, callback){
	options.html = String(options.html).replace(/%emailHeaderImage%/g, constants.emailHeaderImage);
    transporter.sendMail({
        from:  "The Test Co. <"+constants.welcome+">",
        to: options.to,
        subject: options.subject,
        html: options.html,
		attachments:(options.attachments)?options.attachments:''
    }, function(error, info){
        if(error){
            console.log(error);
            callback (false);
        }else{
            console.log('Message sent: ' + info.response);
            console.log (info);
            callback (true);
        }
    });
}
