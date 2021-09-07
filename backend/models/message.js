const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/*--------------------------------------------------------------------------*/
// Import Mongoose Schema
const Schema = mongoose.Schema;

// Create new user schema
const messageSchema = new Schema({
  chatID: { type: Schema.Types.ObjectId, required: true },
  chat: [{ type: Schema.Types.Mixed, required: true }],  
  created_at: { type: String }
});

messageSchema.plugin(uniqueValidator)
  
/*--------------------------------------------------------------------------*/
module.exports = mongoose.model('Message', messageSchema);