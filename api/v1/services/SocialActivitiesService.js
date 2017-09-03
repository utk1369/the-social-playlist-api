var SocialActivity = require('../models/SocialActivities');
var userService = require('./UserService');

var getActivityForGivenId = function(activityId, populateObjList, callback) {
    var query = SocialActivity.findById(activityId)

    if(populateObjList != null && populateObjList.length > 0) {
        for(var i in populateObjList) {
            var populateObj = populateObjList[i];
            query = query.populate(populateObj.path, populateObj.select);
        }
    }
    query.exec(callback);
}

var getActivityForGivenCriteria = function(criteria, callback) {
    SocialActivity.find(criteria, callback);
}

var saveActivity = function(activity, callback) {
    //add custom validators on top
    activity.save(callback);
}

var getFeedForUser = function(userId, callback) {
    userService.fetchById(userId, ['friends.friend'], null, function(err, result) {
        if(err)
            callback(err, null);
        else {
            var friendsArr = [];
            for(var i in result['friends'])
                friendsArr.push(result['friends'][i]['friend']);
            var criteria = { postedBy: {$in: friendsArr}, domain: "PUBLIC" };
            getActivityForGivenCriteria(criteria, callback);
        }
    })
}

module.exports = {
    getActivityById: getActivityForGivenId,
    getActivityByCriteria: getActivityForGivenCriteria,
    save: saveActivity,
    getFeed: getFeedForUser
}
