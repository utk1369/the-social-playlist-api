var mongoose = require('mongoose');
var SongSchema = require('./Songs');

var socialActivitySchema = new mongoose.Schema({
        postedBy: {
            id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        },
        activityType: {type: String, enum: ["dedicate", "recommend", "share"]},
        domain: {type: String, enum: ["public", "private"]},
        recipientUserIds: [{
            id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
        }],
        songMetadata: [SongSchema.metadata],
        likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        createdAt: Date,
        updatedAt: Date
    },
    {
        timestamps: true
    });

var SocialActivity = mongoose.model('SocialActivity', socialActivitySchema);
module.exports = SocialActivity;