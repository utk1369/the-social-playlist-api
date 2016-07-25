var express = require('express');
var router = express.Router();

var mongoose = require('mongoose'); //Mongo Connection
var bodyParser = require('body-parser'); //Parses POST requests
var methodOverride = require('method-override'); //Manipulates POST requests
var User = require('../models/Users');
var UsersDAO = require('../dao/UsersDAO');

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({}, function(err, result) {
        if(err) {
            console.error(err.message);
        } else {
            res.send(result);
        }
    });
});

/*Search users displaying {projections} for the given {criteria}*/
router.post('/search', function(req, res, next) {
    var payload = req.body;
    var criteria = payload.criteria;
    var projections = payload.projections;

    UsersDAO.search(criteria, projections, function(result) {
        res.send(result);
    });
});


/* Create a new user */
router.post('/create', function(req, res, next) {
    var payload = req.body;
    var newUser = new User(payload);

    newUser.save(function(err, result) {
        if(err) {
            console.error(err);
        } else {
            console.log("User created", result);
            resultArr = [result];
            res.send(resultArr);
        }
    });
});

module.exports = router;
