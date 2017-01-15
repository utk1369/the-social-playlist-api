var User = require('../models/Users')

var songService = require('./SongService')

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
        User.find(criteria, projections,callback);
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
    function(userId, fieldsToBeUpdated, callback) {
        User.findByIdAndUpdate(userId, { $set: fieldsToBeUpdated}, { new: true }, callback);
    };

var userService = {
    search: searchUsers,
    create: saveUser,
    updateById: updateUserAttributesById
}

module.exports = userService;