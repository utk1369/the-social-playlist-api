var User = require('../models/Users');

var songService = require('./SongService')

var fetchUserDetailsById =
    function(userId) {
        //this method returns the user details based on the id provided.
        //the result will also populate the friends list along with few basic details like name, status, imageUrl etc
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
    function(userId, fieldsToBeUpdated, fieldsToBePopulated, callback) {
        var query = User.findByIdAndUpdate(userId, { $set: fieldsToBeUpdated}, { new: true });
        if(fieldsToBePopulated != null && fieldsToBePopulated.length > 0)
            query = query.populate(fieldsToBePopulated);
        query.exec(callback);
    };

/*
 * existingUserDetails: Existing User Info for the user
 * newUserDetails: New User Details against which the comparison of the existingUserDetails is to be made
 */
var updateUserDetails =
    function(existingUserDetails, newUserDetails, attributesToUpdate, fieldsToBePopulated, callback) {
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
            updateUserAttributesById(existingUserDetails['_id'], fieldsToBeUpdated, fieldsToBePopulated, callback);
        }
    };

var saveSongsForUser =
    function(userId, songsListToBeSaved, callback) {

        var compareAndSave = function(songsListOfUser, songsToBeSaved) {
            var mergedList = [];

            var findAndRemoveFromList = function(searchElement, listOfSongs) {
                for(var i in listOfSongs) {
                    if(searchElement['id'] === listOfSongs[i]['id']) {
                        var updatedDetails = listOfSongs[i];
                        listOfSongs.splice(i, 1);
                        return updatedDetails;
                    }
                }
                return null;
            }

            for(var i in songsListOfUser) {
                var newSongDetails = findAndRemoveFromList(songsListOfUser[i], songsToBeSaved);
                if(newSongDetails)
                    mergedList.push(newSongDetails);
                else
                    mergedList.push(songsListOfUser[i]);
            }
            mergedList = mergedList.concat(songsToBeSaved);

            updateUserAttributesById(userId, {'songs': mergedList}, null, function(err, result) {
                if(err)
                    callback(err, null);
                else
                    callback(null, result['songs']);
            });
        }

        User.findById(userId, 'songs', function(err, songsListOfUser) {
            if(err) {
                throw new Error("Unable to fetch Songs");
            }
            compareAndSave(songsListOfUser['songs'], songsListToBeSaved);
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
    saveSongs: saveSongsForUser
}

module.exports = userService;