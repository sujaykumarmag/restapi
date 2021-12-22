/*
 * Helpers for various tasks
 *
 */

// Dependencies
var config = require('./config');
var crypto = require('crypto');

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};
//Create a string of random Alphanumeri string
helpers.createRandomString = function(stringlength){
  stringlength = typeof(stringlength) == 'number'&& stringlength>0 ?stringlength:false;
  if(stringlength){
    var possibleCharacters = 'qwertyuioplkjhgfdsaxzcvbnm1234567890';
    //Start the random string
    var str ="";
    for(let i=0; i<stringlength; i++){
      //get random chars from possibleCharacters
      var randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      //Append to this for the final stringlength
      str =str+randomChar;
    }
    return str;
  }else{
    return false;
  }
}
// Export the module
module.exports = helpers;