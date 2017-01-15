var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
        name: {type: String, required: true},
        fbId: {type: String, required: true, unique: true},
        status: String,
        imageUrl: String,
        friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],//need to use selective populate.
        //can be separated out
        songs: [{
            id: {type: Number, required: true},
            metadata: {
                id: {type: Number, required: true},
                title: {type: String, required: true},
                artist: String,
                album: String
            },
            externalLinks: [{
                linkType: {type: String, required: true, enum: ["youtube"]},
                id: {type: String, required: true},
                title: {type: String, required: true},
                thumbnailUrl: String
            }],
            hits: {type: Number, default: 0},
            lastListenedAt: Date,
            likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
            rating: Number,
            socialActivities: [{type: mongoose.Schema.Types.ObjectId, ref: 'SocialActivity'}] //to be added to android
            //socialactivities are associated with every song so that we can query for only relevant activities song wise. also there is no link back from social activity to song
        }],
        createdAt: Date,
        updatedAt: Date
    },
    {
        timestamps: true
    });

var User = mongoose.model('User', userSchema);
module.exports = User;
