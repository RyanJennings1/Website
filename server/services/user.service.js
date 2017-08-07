var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

//var api_key = process.env.API_KEY;
var api_key = "sk_123456789";
var domain = 'mg.hatchtesting.com';

var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
var data = {
  from: 'BullMatch <do-not-reply@bullmatch.com>',
  to: 'ryan.jennings@pinpoint-medical.com',
  subject: 'Password Reset',
  text: 'New password:'
};
 
var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.getByUsername = getByUsername;
service.create = create;
service.passwordReset = passwordReset;
service.update = update;
service.delete = _delete;
service.checkPasswords = checkPasswords;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.users.find().toArray(function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return users (without hashed passwords)
        users = _.map(users, function (user) {
            //return _.omit(user, 'hash');
            return _.omit(user, 'password', 'passwordConfirm');
        });

        deferred.resolve(users);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            //deferred.resolve(_.omit(user, 'hash'));
            deferred.resolve(_.omit(user, 'password', 'passwordConfirm'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getByUsername(userName) {
    var deferred = Q.defer();

    db.users.findOne(
        { username: userName },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                deferred.resolve(_.omit(user, 'password', 'passwordConfirm', 'hash'));
            } else {
                deferred.resolve();
            }
        }
    )

    return deferred.promise;
}

function create(userParam, flag) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                //flag = true;
                createUser();
            }
        });

    function createUser() {
        if (flag) {
          // set user object to userParam without the cleartext password
          var user = _.omit(userParam, 'password', 'passwordConfirm');

          // add hashed password to user object
          user.hash = bcrypt.hashSync(userParam.password, 10);

          db.users.insert(
              user,
              function (err, doc) {
                  if (err) deferred.reject(err.name + ': ' + err.message);

                  deferred.resolve();
              });
        }

        if (!flag) {
          deferred.resolve();
        }
    }
    return deferred.promise;
}

function passwordReset(_id, userParam) {
    _id = userParam._id;
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + userParam.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            username: userParam.username,
            email: userParam.email,
            password: userParam.password,
            passwordConfirm: userParam.passwordConfirm,
        };

        // update password if it was entered
        if (userParam.password) {
            data.text = "The new password for your account is: " + userParam.password;
            // data.to = userParam.email;
            mailgun.messages().send(data, function (error, body) {
              console.log(body);
            });
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }


        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
} // end of passwordReset function

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + userParam.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            username: userParam.username,
            email: userParam.email,
            password: userParam.password,
            passwordConfirm: userParam.passwordConfirm,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }


        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function checkPasswords(userParam, password) {
    var deferred = Q.defer();
    let check;

    db.users.findById(userParam._id, function(err, user) {
        if(err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            check = true;
            deferred.resolve(check);
        } else {
            check = false;
            // authentication failed
            deferred.resolve(check);
        }
    });

    return deferred.promise;
}
