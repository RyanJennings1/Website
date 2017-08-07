var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('posts');

var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

// Need to change this to authenticate posts by title
function authenticate(title) {
    var deferred = Q.defer();

    db.posts.findOne({ title: title }, function (err, post) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (post) {
            // authentication successful
            deferred.resolve({
                _id: post._id,
                title: post.title,
                token: jwt.sign({ sub: post._id }, config.secret)
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

    db.posts.find().toArray(function (err, posts) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(posts);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.posts.findById(_id, function (err, post) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (post) {
            deferred.resolve(post);
        } else {
            // post not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(postParam, flag) {
    var deferred = Q.defer();

    // validation
    db.posts.findOne(
        { title: postParam.title },
        function (err, post) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (post) {
                // title already exists
                deferred.reject('Title "' + postParam.title + '" is already taken');
            } else {
                //flag = true;
                createPost();
            }
        });

    function createPost() {
        if (flag) {
          var post = postParam;

          db.posts.insert(
              post,
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

function update(_id, postParam) {
    var deferred = Q.defer();

    // validation
    db.posts.findById(_id, function (err, post) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (post.title !== postParam.title) {
            // title has changed so check if the new title is already taken
            db.posts.findOne(
                { title: postParam.title },
                function (err, post) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (post) {
                        // Title already exists
                        deferred.reject('Title "' + req.body.title + '" is already taken');
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
            title: postParam.title,
            text: postParam.text,
            image: postParam.image,
            date: postParam.date,
            seconds: postParam.seconds,
        };

        db.posts.update(
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

    db.posts.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
