/*
 * Request Handlers
 *
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');

// Define all the handlers
var handlers = {};

// Ping
handlers.ping = function (data, callback) {
  callback(200);
};

// Not-Found
handlers.notFound = function (data, callback) {
  callback(404);
};

// Users
handlers.users = function (data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function (data, callback) {
  // Check that all required fields are filled out
  var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
  if (firstName && lastName && phone && password && tosAgreement) {
    // Make sure the user doesnt already exist
    _data.read('users', phone, function (err, data) {
      if (err) {
        // Hash the password
        var hashedPassword = helpers.hash(password);
        // Create the user object
        if (hashedPassword) {
          var userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'phone': phone,
            'hashedPassword': hashedPassword,
            'tosAgreement': true
          };
          // Store the user
          _data.create('users', phone, userObject, function (err) {
            if (!err) {
              callback(200, { 'success': "Created User" });
            }
            else {
              console.log(err);
              callback(500, { 'Error': 'Could not create the new user' });
            }
          });
        } else {
          callback(500, { 'Error': 'Could not hash the user\'s password.' });
        }
      } else {
        // User alread exists
        callback(400, { 'Error': 'A user with that phone number already exists' });
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required fields' });
  }
};

// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object. Dont let them access anyone elses.
handlers._users.get = function (data, callback) {
  // Check that phone number is valid
  var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  //get the token from the headers

  if (phone) {
    var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
    //veriofy the token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function (err) {
      if (err) {
        _data.read('users', phone, function (err, data) {
          if (!err && data) {
            // Remove the hashed password from the user user object before returning it to the requester
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, { 'Error': 'Missing Required the header' })
      }
    })
  } else {
    callback(400, { 'Error': 'Missing required field' })
  }
};


// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let an authenticated user up their object. Dont let them access update elses.
handlers._users.put = function (data, callback) {

  // Check for required field 
  var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if (phone) {
    // Error if nothing is sent to update
    if (firstName || lastName || password) {
      var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
      //veriofy the token is valid for the phone number
      handlers._tokens.verifyToken(token, phone, function (err) {
        if (err) {
          _data.read('users', phone, function (err, userData) {
            if (!err && userData) {
              // Update the fields if necessary
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.hashedPassword = helpers.hash(password);
              }
              // Store the new updates
              _data.update('users', phone, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, { 'Error': 'Could not update the user.' });
                }
              });
            } else {
              callback(400, { 'Error': 'Specified user does not exist.' });
            }
          });

        } else {
          callback(403, { 'Error': 'Missing Required the header' })
        }
      })
      // Lookup the user

    } else {
      callback(400, { 'Error': 'Missing fields to update.' });
    }
  } else {
    callback(400, { 'Error': 'Missing required field.' });
  }

};
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let an authenticated user up their object. Dont let them access update elses.
handlers._users.delete = function (data, callback) {
  // Check for required field
  var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if (phone) {
    // Lookup the user
    var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
    //veriofy the token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function (err) {
      if (err) {
        _data.read('users', phone, function (err, data) {
          if (!err && data) {
            _data.delete('users', phone, function (err) {
              if (!err) {
                callback(200);
              } else {
                callback(500, { 'Error': 'Could not delete the specified user' });
              }
            });
          } else {
            callback(400, { 'Error': 'Could not find the specified user.' });
          }
        });
      } else {
        callback(403, { 'Error': 'Missing Required the header' })
      }

    })

  }
  else {
    callback(400, { 'Error': 'Missing required field' })
  }
};


handlers.tokens = function (data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

//container
handlers._tokens = {};

//post Request
//Required data: phone, password
//optional parameters:none
handlers._tokens.post = function (data, callback) {
  var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if (phone && password) {
    //lookup who matches with the previous db
    _data.read('users', phone, function (err, Data) {
      if (!err && Data) {
        //hash the sent password and compare it with the password stored in the  userObject
        var hashedPassword = helpers.hash(password);
        if (hashedPassword == Data.hashedPassword) {
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            'phone': phone,
            'id': tokenId,
            'expires': expires
          };
          //storing the tokenId
          _data.create('tokens', tokenId, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject)
            } else {
              callback(500, { 'Error': "Error for creating token" })
            }
          })
        } else {
          callback(400, { "Error": "Password mismatch" });
        }
      } else {
        callback(400, { 'Error': "Could not find the user" })
      }
    })
  } else {
    callback(400, { 'Error': "Missing Required fields" })
  }
}

// Tokens=GET
// Required data: phone
// Optional data: none
handlers._tokens.get = function (data, callback) {
  var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length > 0 ? data.queryStringObject.id.trim() : false;
  if (id) {
    // Lookup the user
    _data.read('tokens', id, function (err, data) {
      if (!err && data) {
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { 'Error': 'Missing required field' })
  }

}

//tokens-put function
//required data :id,extend
//optional data :none
handlers._tokens.put = function (data, callback) {
  var id = typeof (data.payload.id) == 'string' && data.payload.id.trim().length > 0 ? data.payload.id.trim() : false;
  var extend = typeof (data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
  if (id && extend) {
    //Lookup the token
    _data.read('tokens', id, function (err, Data) {
      if (!err && data) {
        //Check the token isn't expired
        if (Data.expires > Date.now()) {
          //set the expiration 
          Data.expires = Data.now + 1000 * 60 * 60;
          _data.update('tokens', id, Data, function (err) {
            if (!err) {
              callback(200)
            } else {
              callback(500, { "Error": "Couldn't update expiration" })
            }
          })

        } else {
          callback(400, { "Error": "Token Already expired" });
        }

      } else {
        callback(400, { 'Error': "No file Existed" })
      }
    })

  } else {
    callback(400, { "Error": "Invalid Payload" })
  }
}

//Tokens-Delete
//Required data: id
//Optional data: none
handlers._tokens.delete = function (data, callback) {
  var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length > 0 ? data.queryStringObject.id.trim() : false;
  if (id) {
    // Lookup the user
    _data.read('tokens', id, function (err, Data) {
      if (!err && Data) {
        _data.delete('tokens', id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { 'Error': 'Could not delete the specified user' });
          }
        });
      } else {
        callback(400, { 'Error': 'Could not find the specified user.' });
      }
    });
  }
  else {
    callback(400, { 'Error': 'Missing required field' })
  }
}


//verift if the given id is currently valid for the user
handlers._tokens.verifyToken = function (id, phone, callback) {
  _data.read('tokens', id, function (err, Data) {
    if (!err && Data) {
      //check that the user token data is not expired
      if (Data.phone == phone && Data.expires > Date.now()) {
        callback(true)
      } else {
        callback(false)
      }
    } else {
      callback(false)
    }
  })

}
// Export the handlers
module.exports = handlers;