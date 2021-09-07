const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*--------------------------------------------------------------------------*/
// Import Mongoose Schema
const Schema = mongoose.Schema;

// Create new user schema
const userSchema = new Schema({
  image: { type: String, required: true, minlength: 0 },
  role: { type: String, required: true },
  firstname: { type: String, required: true, trim: true, minlength: 2 },
  lastname: { type: String, required: true, trim: true, minlength: 2 },
  activate: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true, trim: true, validate: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ },
  password: { type: String, required: true, validate: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?!@#.+-_$%^&*])(?=.{8,32})/ },
  playlists: [{ type: mongoose.Types.ObjectId, ref: 'Playlist' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comments' }],
  matches: [{ type: Schema.Types.Mixed, ref: 'User'}],
  chatIDs: [{ type: mongoose.Types.ObjectId, ref: 'Message'}],
  created_at: { type: Date, default: Date.now },  
});

userSchema.plugin(uniqueValidator);
  
/*--------------------------------------------------------------------------*/
module.exports = mongoose.model('User', userSchema);
