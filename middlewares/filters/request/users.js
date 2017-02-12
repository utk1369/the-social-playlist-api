var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser'); //Parses POST requests
var methodOverride = require('method-override'); //Manipulates POST requests
var userService = require('../../../services/UserService');


router.use('/login',  function(req, res, next) {
    var compressFlag = req.param('compress');
    if(compressFlag) {
        var userInfo = req.body;
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
                for(var i in fbIdToUserIdMap) {
                    friendsList[i]['fbId'] = fbIdToUserIdMap[i]['fbId'];
                    friendsList[i]['friend'] = fbIdToUserIdMap[i]['_id'];
                }
                userInfo['friends'] = friendsList;
                req.body = userInfo;
                return next();
            })
        } else {
            return next();
        }
    } else {
        return next();
    }
});

module.exports = {
    router: router,
    userService: userService
};
