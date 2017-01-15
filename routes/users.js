var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //Parses POST requests
var methodOverride = require('method-override'); //Manipulates POST requests
var User = require('../models/Users');
var userService = require('../services/UserService');

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
    var projectionsArr = payload.projections;

    userService.search(criteria, projectionsArr, function(err, result) {
        if(err) {
            console.log("User retrieval failed");
            throw new Error("Failed to search User");
        }
        res.send(result);
    });
});


/* Create a new user */
router.post('/create', function(req, res, next) {
    var payload = req.body;
    var newUser = new User(payload);

    userService.create(newUser, function(err, savedNewUser) {
        if(err) {
            console.log("Error occured while saving User");
            throw new Error("User creation failed");
        }
        console.log("User created", savedNewUser);
        res.send(savedNewUser);
    })
});

router.post('/updateAttributes', function(req, res, next) {
    var updatePayload = req.body;
    var userId = req.param('id');
    if(userId == null)
        throw new Error('User Id not provided for update.');

    userService.updateById(userId, updatePayload, function(err, savedUser) {
        if(err) {
            console.log("Failed to update user attributes.");
            throw new Error("User Attributes update failed.");
        }
        console.log("User details updated", savedUser);
        res.send(savedUser);
    });
});

module.exports = router;
