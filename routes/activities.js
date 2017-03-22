var express = require('express');
var router = express.Router();
var activityService = require('../services/SocialActivitiesService')
var Activity = require('../models/SocialActivities');


router.post('/create', function(req, res, next) {
    var payload = req.body;
    var newActivity = new Activity(payload);

    activityService.save(newActivity, function(err, savedNewActivity) {
        if(err) {
            console.log("Error occured while saving Activity");
            throw new Error("Activity creation failed");
        }
        console.log("Activity created", savedNewActivity);
        res.send(savedNewActivity);
    })
});

router.post('/fetch/:id', function(req, res, next) {
    var activityId = req.params.id;
    var populateObjList = req.body;
    activityService.getActivityById(activityId, populateObjList, function(err, activity) {
        if(err) {
            throw new Error('Activity not found');
        }
        res.send(activity);
    })
})


module.exports = router;