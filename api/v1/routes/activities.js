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

router.post('/search', function(req, res, next) {
    var searchPayload = req.body;
    activityService.getActivityByCriteria(searchPayload, function(err, searchResults) {
        if(err) {
            throw new Error('Error occurred while searching activities for the given criteria');
        } else {
            res.send(searchResults);
        }
    })
})

router.get('/feed/:userId', function(req, res, next) {
    var userId = req.params.userId;
    activityService.getFeed(userId, function(err, feeds) {
        if(err) {
            throw new Error('Error occurred while fetching feeds for the user.');
        } else {
            res.send(feeds);
        }
    })
})


module.exports = router;