const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*--------------------------------------------------------------------------*/
// Import Mongoose Schema
const Schema = mongoose.Schema;

// Create new user schema
const commentSchema = new Schema({
  writerId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  writer: { type: String, required: true, ref: 'User firstname' },
  writerImage: { type: String, required: true, ref: 'User image' },
  playlist: { type: mongoose.Types.ObjectId, required: true, ref: 'Playlist' },
  content: { type: String, required: true, trim: true, minlength: 2 },
  created_at: { type: String }  
});

commentSchema.plugin(uniqueValidator)
  
/*--------------------------------------------------------------------------*/
module.exports = mongoose.model('Comment', commentSchema);