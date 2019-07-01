/**
* Objective: A common function to define some exportable constants throughout the application.
*/

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}
// define required constants.
define("adminEmail", "test.test@test.com");
define("welcome", "test.test@test.com");
define("customerservice", "test.test@test.com");
define("kitchen", "test.test@test.com");
define("facebookURL", "https://www.facebook.com/test/");
define("twitterURL", "https://twitter.com/test/");
define("PaymentRedirectURL", "");