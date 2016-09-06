var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
        name: {type: String, required: true},
        fbId: {type: String, required: true},
        status: String,
        imageUrl: String,
        friends: [mongoose.Schema.Types.ObjectId],
        songs: [{
            id: {type: Number, required: true},
            metadata: {
                title: {type: String, required: true},
                artist: String,
                album: String
            },
            externalLinks: {
                youtube: String
            },
            hits: {type: Number, default: 0},
            lastListenedAt: Date,
            likes: [mongoose.Schema.Types.ObjectId],
            rating: Number
        }],
        socialActivities: [{
            activityType: {type: String, enum: ["dedication", "recommendation", "share"]},
            domain: {type: String, enum: ["public", "private"]},
            recipientUserIds: [mongoose.Schema.Types.ObjectId],
            externalLinks: {
                youtube: String
            },
            timestamp: Date
        }],
        createdAt: Date,
        updatedAt: Date
    },
    {
        timestamps: true
    });

var User = mongoose.model('User', userSchema);
module.exports = User;
