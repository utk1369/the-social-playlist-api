var mongoose = require('mongoose');
var SongSchema = require('./Songs');

var socialActivitySchema = new mongoose.Schema({
        postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        caption: {type: String},
        parentActivity: {type: mongoose.Schema.Types.ObjectId, ref: 'SocialActivity'},
        activityType: {type: String, enum: ["dedicate", "recommend", "share"], required: true},
        domain: {type: String, enum: ["public", "private"], default: "public"},
        recipientUserIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        songMetadata: SongSchema.metadata,
        likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        createdAt: Date,
        updatedAt: Date
    },
    {
        timestamps: true
    });

var SocialActivity = mongoose.model('SocialActivity', socialActivitySchema);
module.exports = SocialActivity;