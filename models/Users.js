var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
        name: {type: String, required: true},
        fbId: {type: String, required: true},
        songsCollection: [{
            songId: {type: Number, required: true},
            metadata: {
                songName: {type: String, required: true},
                artist: String,
                album: String
            },
            youtubeLink: String,
            hits: {type: Number, default: 0},
            lastListened: Date,
            likes: [mongoose.Schema.Types.ObjectId],
            rating: Number
        }],
        dedications: [{
            targetUserId: mongoose.Schema.Types.ObjectId,
            youtubeLink: String,
            timestamp: Date,
            share: Boolean
        }],
        recommendations: [{
            targetUserId: mongoose.Schema.Types.ObjectId,
            youtubeLink: String,
            timestamp: Date,
            share: Boolean,
        }],
        createdAt: Date,
        updatedAt: Date
    },
    {
        timestamps: true
    });

var User = mongoose.model('User', userSchema);
module.exports = User;
