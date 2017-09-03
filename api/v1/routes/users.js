var usersFilters = require('../middlewares/filters/request/users');
var router = usersFilters.router;
var userService = usersFilters.userService;
var User = require('../models/Users');
var activityService = require('../services/SocialActivitiesService')
var Activity = require('../models/SocialActivities');

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({}).populate('friends.friend').exec(function(err, result) {
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
    var populate = req.param('populate');
    var fieldsToBePopulated = null;
    if(populate)
        fieldsToBePopulated = populate.split(',');
    var updatePayload = req.body;
    var userId = req.param('id');
    if(userId == null)
        throw new Error('User Id not provided for update.');

    userService.updateById(userId, updatePayload, fieldsToBePopulated, function(err, savedUser) {
        if(err) {
            console.log("Failed to update user attributes.");
            throw new Error("User Attributes update failed.");
        }
        console.log("User details updated", savedUser);
        res.send(savedUser);
    });
});

router.post('/login', function(req, res, next) {
    var payload = req.body;
    var newUserDetails = new User(payload['user']);
    var populateObjList = payload['populate'];

    var fetchUserCallback =  function(err, existingUserDetails) {
        if(err) {
            console.log("User retrieval failed");
            throw new Error("Failed to find User");
        }
        userService.updateUserDetails(existingUserDetails, newUserDetails,
            ['name', 'imageUrl', 'friends'], populateObjList, function(err, updatedUserDetails) {
                if(err) {
                    throw new Error("Update Failed", err);
                }
                console.log("User details updated", updatedUserDetails);
                res.send(updatedUserDetails);
        })
    };
    userService.fetchUserDetailsByFbId(newUserDetails['fbId'], false, fetchUserCallback);
});

router.post('/profile/:id', function(req, res, next) {
    var payload = req.body;
    var userId = req.params.id;
    var projectionsArr = payload['projections'];
    var populateObjList = payload['populate'];

    userService.fetchById(userId, projectionsArr, populateObjList, function(err, profile) {
        if(err) {
            throw new Error("Error in obtaining user details");
        }
        console.log("Fetched User Profile for id: ", profile._id);
        res.send(profile);
    })
})

router.post('/:id/songs/save', function(req, res, next) {
    var userId = req.params.id;
    var listOfSongsToBeSaved = req.body;
    userService.saveSongs(userId, listOfSongsToBeSaved, function(err, result) {
        if(err) {
            throw new Error("Failed to add songs");
        }
        res.send(result);
    })
});

router.post('/:id/songs/remove', function(req, res, next) {

});

router.post('/activity/save', function(req, res, next) {
    var payload = req.body;
    var activityToBeSaved = new Activity(payload);
    var userId = activityToBeSaved['postedBy'];

    activityService.save(activityToBeSaved, function(err, savedActivity) {
        if(err) {
            throw new Error('Save failed for this activity');
        } else {
            if(savedActivity['songMetadata'] == null) {
                res.send(savedActivity);
            } else {
                userService.linkSongToActivity(userId, savedActivity['songMetadata'], savedActivity._id, function(err, result) {
                    if(err){
                        throw new Error('Linking failed for this song and activity');
                    } else {
                        res.send(savedActivity);
                    }
                })
            }
        }
    })
});

module.exports = {
    router: router
}
