const { Int32 } = require('mongodb');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*--------------------------------------------------------------------------*/
// Import Mongoose Schema
const Schema = mongoose.Schema;

// Create new user schema
const playlistSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  playlistTracks: { type: Array, required: true },
  creatorId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  creator: { type: String, required: true },
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User id' }],
  created_at: { type: Date, default: Date.now }  
});

playlistSchema.plugin(uniqueValidator)
  
/*--------------------------------------------------------------------------*/
module.exports = mongoose.model('Playlist', playlistSchema);
