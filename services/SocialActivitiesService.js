var SocialActivity = require('../models/SocialActivities');

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

var getActivityForGivenCriteria = function(criteria, populateObjects, callback) {

}

var saveActivity = function(activity, callback) {
    //add custom validators on top
    activity.save(callback);
}

module.exports = {
    getActivityById: getActivityForGivenId,
    getActivityByCriteria: getActivityForGivenCriteria,
    save: saveActivity
}
