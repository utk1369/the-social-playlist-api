var User = require('../models/Users');

var usersDAO = {
    search: function(criteria, projection, callback) {
        User.find(criteria, function(err, result) {
            if(err) throw err;
            callback(result);
        });
    }
}

module.exports = usersDAO;