var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songMetadataSchema = new Schema({
    id: {type: Number, required: true},
    title: {type: String, required: true},
    artist: String,
    album: String
}, { _id : false });

var externalLinksSchema = new Schema({
    linkType: {type: String, required: true, enum: ["youtube"]},
    id: {type: String, required: true},
    title: {type: String, required: true},
    thumbnailUrl: String
}, { _id : false });

var songSchema = new Schema({
    id: {type: Number, required: true},
    metadata: songMetadataSchema,
    externalLinks: [externalLinksSchema],
    hits: {type: Number, default: 0},
    lastListenedAt: Date,
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    rating: Number,
    socialActivities: [{type: mongoose.Schema.Types.ObjectId, ref: 'SocialActivity'}]
    //socialActivities are associated with every song so that we can query for only relevant activities song wise.
    //also there is no link back from social activity to song
}, { _id : false });

module.exports = {
    song: songSchema,
    metadata: songMetadataSchema,
    externalLinks: externalLinksSchema
};
