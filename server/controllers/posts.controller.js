var config = require('config.json');
var express = require('express');
var router = express.Router();
var postService = require('services/post.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/:_id', getOne);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);

module.exports = router;

// Need to change this to authenticate posts by tag
function authenticate(req, res) {
    postService.authenticate(req.body.tag)
        .then(function (post) {
            if (post) {
                // authentication successful
                res.send(post);
            } else {
                // authentication failed
                res.status(401).send('Post data is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function register(req, res) {
    console.log('in post register');
    postService.create(req.body.post, req.body.flag)
        .then(function () {
            res.send(res.req.body.post);
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    postService.getAll()
        .then(function (posts) {
            res.send(posts);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getOne(req, res) {
  postService.getById(req.params._id)
    .then(function (post) {
      if (post) {
        res.send(post);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

function getCurrent(req, res) {
    postService.getById(req.post.sub)
        .then(function (post) {
            if (post) {
                res.send(post);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    postService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    postService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
