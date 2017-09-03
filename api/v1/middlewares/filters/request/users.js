var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //Parses POST requests
var methodOverride = require('method-override'); //Manipulates POST requests
var userService = require('../../../services/UserService');


router.use('/login',  function(req, res, next) {
    var compressFlag = req.param('compress');
    if(compressFlag != null && compressFlag === 'true') {
        var userInfo = req.body['user'];
        var friendsList = userInfo['friends'];
        if(friendsList != null && friendsList.length > 0) {
            var fbIds = [];
            for(var i in friendsList) {
                fbIds.push(friendsList[i]['fbId']);
            }
            userService.fbIdToUserIdMap(fbIds, function(err, fbIdToUserIdMap) {
                if(err) {
                    console.log("Failed to fetch userids for given fbids");
                    throw new Error("Failed to fetch userids for given fbids");
                }
                var existingUsers = [];
                for(var i in fbIdToUserIdMap) {
                    existingUsers[i] = {};
                    existingUsers[i]['fbId'] = fbIdToUserIdMap[i]['fbId'];
                    existingUsers[i]['friend'] = fbIdToUserIdMap[i]['_id'];
                }
                userInfo['friends'] = existingUsers;
                req.body['user'] = userInfo;
                return next();
            })
        } else {
            return next();
        }
    } else {
        //perform a payload check for the friends list and forward it to next only when the payload is correct or else throw a bad request error.
        return next();
    }
});

module.exports = {
    router: router,
    userService: userService
};
