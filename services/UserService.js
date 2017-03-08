var User = require('../models/Users');

var fetchUserDetailsById =
    function(userId, projectionsArr, populateObjList, callback) {
        var projections = null;
        if(projectionsArr != null)
            projections = projectionsArr.join(' ');

        var query = User.findById(userId, projections);
        if(populateObjList != null && populateObjList.length > 0) {
            for(var i in populateObjList) {
                var populateObj = populateObjList[i];
                query = query.populate(populateObj.path, populateObj.select);
            }
        }
        query.exec(callback);
    }

/*
    this method returns the user details based on the id provided.
    the result will also populate the friends list along with few basic details like name, status, imageUrl etc
*/
var fetchUserDetailsByFbId =
    function(fbId, populateFriends, callback) {
        if(!populateFriends)
            User.findOne({fbId: fbId}, null, callback);
    }

var getFbIdToUserIdMap =
    function(fbIds, callback) {
        User.find({ fbId: {$in: fbIds}}, 'fbId _id', callback);
    }

/*
    * userId: _id of the user whose friends are to be compared and updated
    * friendsToBeAdded: List of FB Ids of users who are to be added as friends of userId
 */
var addFriendsForUser =
    function(userId, friendsToBeAdded, callback) {
        if(friends == null || friendsToBeAdded.length === 0)
            callback(null, []);
        User.find({ fbId: {$in: friendsToBeAdded}}, '_id', function(err, result) {
            if(err) {
                callback(err, null);
            } else {
                User.findByIdAndUpdate(userId, {$pushAll: {friends: result}}, {new: true, upsert: true}, callback);
            }
        });
    }

/*
    * userId: _id of the user whose friends are to be compared and updated
    * existingFriendsList: list of users who are already friends with userId on TSP
    * newFriendsList: List of users who are friends with userId on FB
 */
var updateFriendsListForUser =
    function(existingUserDetails, newUserDetails, callback) {
        var friendsToAdd = []; var newFriendsList = newUserDetails['friends']; var existingFriendsList = existingUserDetails['friends'];
        for(var i in newFriendsList['friends']) {
            var fbIdToSearch = newFriendsList[i]['fbId'];
            var found = false;
            for(var j in existingFriendsList) {
                if(existingFriendsList[j]['fbId'] === fbIdToSearch) {
                    found = true; break;
                }
            }
            if(!found)
                friendsToAdd.push(newFriendsList[i]);
        }
        addFriendsForUser(existingUserDetails['_id'], friendsToAdd, callback);
    }

/* searchUsers --> returns a list of users matching the specified criteria
 * criteria: the selection criteria analogous to the WHERE clause in SQL
 * projections: the properties to be selected and returned for each of the results, analogous to the SELECT clause in SQL
 * callback: a results handler after the results are retrieved
 */
var searchUsers =
    function(criteria, projectionsArr, callback) {
        var projections = null;
        if(projectionsArr != null)
            projections = projectionsArr.join(' ');
        User.find(criteria, projections, callback);
    };

/*
 * user: The User Model which has to be inserted/saved.
 * callback: a results handler after the results are retrieved
 */
var saveUser =
    function(user, callback) {
        user.save(callback);
    };

/*
    * userId: The user whose attributes are to be updated
    * fieldsToBeUpdated: will overwrite the values for all the fields provided in this object
    * options: {new: true} ensures that always the modified object is returned
 */
var updateUserAttributesById =
    function(userId, fieldsToBeUpdated, populateObjList, callback) {
        var query = User.findByIdAndUpdate(userId, { $set: fieldsToBeUpdated}, { new: true });
        if(populateObjList != null && populateObjList.length > 0) {
            for(var i in populateObjList) {
                var populateObj = populateObjList[i];
                query = query.populate(populateObj.path, populateObj.select);
            }
        }
        query.exec(callback);
    };

/*
 * existingUserDetails: Existing User Info for the user
 * newUserDetails: New User Details against which the comparison of the existingUserDetails is to be made
 */
var updateUserDetails =
    function(existingUserDetails, newUserDetails, attributesToUpdate, populateObjList, callback) {
        if(existingUserDetails == null) {
            saveUser(newUserDetails, callback);
        } else if(newUserDetails == null) {
            callback(null, existingUserDetails);
        } else {
            var PRIMITIVE_ATTRIBUTES = ['name', 'status', 'imageUrl'];
            var fieldsToBeUpdated = {};
            for(var i in PRIMITIVE_ATTRIBUTES) {
                var attribute = PRIMITIVE_ATTRIBUTES[i];
                if(attributesToUpdate.indexOf(attribute) != -1
                    &&!(newUserDetails[attribute] === existingUserDetails[attribute]))
                    fieldsToBeUpdated[attribute] = newUserDetails[attribute];
            }
            if(attributesToUpdate.indexOf('friends') != -1)
                fieldsToBeUpdated['friends'] = newUserDetails['friends'];
            updateUserAttributesById(existingUserDetails['_id'], fieldsToBeUpdated, populateObjList, callback);
        }
    };

var saveSongsForUser =
    function(userId, songsListToBeSaved, callback) {

        var compareAndSave = function(songsListOfUser, songsToBeSaved) {
            var mergedMap = {}; var mergedList = [];
            var aggregatedList = songsListOfUser.concat(songsToBeSaved);
            for(var i in aggregatedList) {
               mergedMap[aggregatedList[i]['id']] = aggregatedList[i];
            }

            for(var id in mergedMap) {
                mergedList.push(mergedMap[id]);
            }

            updateUserAttributesById(userId, {'songs': mergedList}, null, function(err, result) {
                if(err)
                    callback(err, null);
                else
                    callback(null, result['songs']);
            });
        }

        User.findById(userId, 'songs', function(err, songsListOfUser) {
            if (err) {
                callback(err, null);
            } else {
                compareAndSave(songsListOfUser['songs'], songsListToBeSaved);
            }
        })
    }

var linkSongToActivity =
    function(userId, songToBeLinked, activityId, callback) {
        User.findById(userId, 'songs', function(err, songsListOfUser) {
            if(err) {
                callback(err, null);
            } else {    
                for(var i in songsListOfUser['songs']) {
                    var song = songsListOfUser['songs'][i];
                    if(songToBeLinked['id'] === song['id']) {
                        if(song['socialActivities'] == null)
                            song['socialActivities'] = [];
                        song['socialActivities'].push(activityId);
                        songsListOfUser['songs'][i] = song;
                        break;
                    }
                }
                updateUserAttributesById(userId, {'songs': songsListOfUser['songs']}, null, function(err, result) {
                    if(err)
                        callback(err, null);
                    else {
                        for(var i in result['songs']) {
                            if(result['songs'][i]['id'] === songToBeLinked['id']) {
                                callback(null, result['songs'][i]);
                                break;
                            }
                        }
                    }
                });
            }
        })
    }


var userService = {
    search: searchUsers,
    create: saveUser,
    updateById: updateUserAttributesById,
    updateUserDetails: updateUserDetails,
    fetchUserDetailsByFbId: fetchUserDetailsByFbId,
    updateFriendsListForUser: updateFriendsListForUser,
    fbIdToUserIdMap: getFbIdToUserIdMap,
    saveSongs: saveSongsForUser,
    fetchById: fetchUserDetailsById,
    linkSongToActivity: linkSongToActivity
}

module.exports = userService;