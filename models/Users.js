var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SongSchema = require('./Songs');

var userSchema = new Schema({
        name: {type: String, required: true},
        fbId: {type: String, required: true, unique: true},
        status: String,
        imageUrl: String,
        friends: [{
            friend: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            fbId: String
        }],
        songs: [SongSchema.song],
        createdAt: Date,
        updatedAt: Date
    },
    {
        timestamps: true
    });

var User = mongoose.model('User', userSchema);
module.exports = User;
