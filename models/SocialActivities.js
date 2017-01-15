var mongoose = require('mongoose');

var socialActivitySchema = new mongoose.Schema({
    postedBy: {
        id: {type: mongoose.Schema.Types.ObjectId},
        name: String
    }, //to be added in android dto
    activityType: {type: String, enum: ["dedicate", "recommend", "share"]},
    domain: {type: String, enum: ["public", "private"]},
    recipientUserIds: [{
        id: {type: mongoose.Schema.Types.ObjectId},
        name: String
    }],
    externalLinks: [{
        linkType: {type: String, required: true, enum: ["youtube"]},
        id: String,
        title: String,
        thumbnailUrl: String
    }],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], //to be added in android dto
    timestamp: Date
})

var SocialActivity = mongoose.model('SocialActivity', socialActivitySchema);
module.exports = SocialActivity;