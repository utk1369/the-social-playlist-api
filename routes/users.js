var usersFilters = require('../middlewares/filters/request/users');
var router = usersFilters.router;
var userService = usersFilters.userService;
var User = require('../models/Users');

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

router.post('/login', function(req, res, next) {
    var friendsPreview = req.param['friendsPreview'];
    var payload = req.body;
    var newUserDetails = new User(payload);

    var fetchUserCallback =  function(err, existingUserDetails) {
        if(err) {
            console.log("User retrieval failed");
            throw new Error("Failed to find User");
        }
        userService.updateUserDetails(existingUserDetails, newUserDetails, ['name', 'status', 'imageUrl', 'friends'], function(err, updatedUserDetails) {
            if(err) {
                throw new Error("Update Failed");
            }
            console.log("User details updated", updatedUserDetails);
            res.send(updatedUserDetails);
        })
    };
    userService.fetchUserDetailsByFbId(newUserDetails['fbId'], false, fetchUserCallback);
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

module.exports = {
    router: router
}
