// User validation and auth
const { validationResult } = require('express-validator');
const mongoose = require('mongoose')
const HttpError = require('../models/http-error')
// Import models
const User = require('../models/user')
const Message = require('../models/message');
const dotenv = require('dotenv').config();
const Pusher = require("pusher");

// Set pusher with app information
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: process.env.PUSHER_APP_USE_TLS
  });

/* -------------------------------------------------------------- */
// Get all chats
const getChatsByUserId = async (req, res, next) => {
  const userId = req.params.userId

  let chats;
  let user;
  try {
    // Find user with id 
    user = await User.findById(userId)
    // Find messages
    chats = await Message.find({});
  } catch (err) {
    //console.log(err);
    const error = new HttpError('Fetching chats failed, please try again later.');
    return next(error);
  }


  if (!user) {
    const error = new HttpError('Could not find user for provided id.');
    return next(error);
  }

  if (!chats) {
    const error = new HttpError('Could not find any chats.');
    return next(error);
  }

// Get chat ids
let ids = user.chatIDs.map(chat => chat)

let foundChats = [];

// If chat with id exists, push it to the found chats array
chats.forEach(element => {
  if(ids.includes(element.chatID)) {
    foundChats.push(element)
  }
});

  // Converting response back to JavaScript Object and removing underscore before the id 
  res.json({ chats: foundChats.map(chat => chat.toObject({ getters:true }))});
};

/* -------------------------------------------------------------- */
// Get all messages
const getChatMessagesByChatID = async (req, res, next) => {
    const chatId = req.params.chatID


    let messages;
    try {
      // Find messages with chat id
      messages = await Message.findOne({chatID: chatId})
      
    } catch (err) {
      console.log(err);
      const error = new HttpError('Fetching messages failed, please try again later.');
      return next(error);
    }
   
    // Converting response back to JavaScript Object and removing underscore before the id
    res.json({messages: messages.chat.map(msg => msg).toObject({ getters:true })})
    
  }

/* -------------------------------------------------------------- */
// Create new comment
const createMessage = async (req, res, next) => {
  // Validate message input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.'));
    }
   
    //console.log(req.body);
    let date = new Date()

    // Create new message with message model
     const createdMessage = new Message({
        chat: {"message": req.body.message, "currentUser": req.body.currentUser, "sendToUser": req.body.sendToUser},
        chatID: req.params.id,
        created_at: date.toDateString()
      });

    let user;
    let anotherUser;
    try {
      user = await User.findById(req.body.currentUser.id);
      anotherUser = await User.findById(req.body.sendToUser.id)

    } catch (err) {
      const error = new HttpError(
        'Creating a new comment failed, please try again.');
      return next(error);
    }
 
    if (!user) {
      const error = new HttpError('Could not find user for provided id.');
      return next(error);
    }

    if (!anotherUser) {
      const error = new HttpError('Could not find user for provided id.');
      return next(error);
    }

    try {
      // start session
      const sess = await mongoose.startSession();
      sess.startTransaction();
      // save new message in the session
      await createdMessage.save({ session: sess });
      // push chat ids to both user information
      await user.chatIDs.push(createdMessage.chatID)
      await anotherUser.chatIDs.push(createdMessage.chatID)
      // Save changes
      await user.save({ session: sess });
      await anotherUser.save({ session: sess })
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Creating the new comment failed, please try again.');
      return next(error);
    }

    // Show message instantly in the chat with pusher
    pusher.trigger( 'beats', 'messages', {
          
        message: req.body.message,
        currentUser: req.body.currentUser,
        sendToUser: req.body.sendToUser,
        chatID: req.params.id

    });
 
    // Return the new created message
    res.status(201).json({ messages: createdMessage })
    
  };

  /* -------------------------------------------------------------- */
// Create new comment
const updateChat = async (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.'));
  }
 
  let message;

  try {
    message = await Message.findOne({chatID: req.params.id});
  } catch (err) {
    const error = new HttpError(
      'Finding the chat failed');
    return next(error);
  }

  if (!message) {
    const error = new HttpError('Could not find message with provided id');
    return next(error);
  }

  // if right message found, push the new message to chat
  if(message) {
    message.chat.push({"message": req.body.message, "currentUser": req.body.currentUser, "sendToUser": req.body.sendToUser})
  } 

  let user;
  try {
    // find user with id to save the new chat in the user information
    user = await User.findById(req.body.currentUser.id);

  } catch (err) {
    const error = new HttpError(
      'Creating a new chat message failed, please try again.');
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.');
    return next(error);
  }

  try {
    // start session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Save changes to chat and user
    await message.save({session: sess})
    await user.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Creating the new chat message failed, please try again.');
    return next(error);
  }
// Show message instantly in the chat with pusher
  pusher.trigger( 'beats', 'messages', {
        
      message: req.body.message,
      currentUser: req.body.currentUser,
      sendToUser: req.body.sendToUser,
      chatID: req.params.id
      
  });
  // Return new messge in the chat
  res.status(201).json({ messages: message.chat.map(chatmsg => chatmsg.message) }); 
};
/* -------------------------------------------------------------- */
exports.getChatMessagesByChatID = getChatMessagesByChatID;
exports.createMessage = createMessage
exports.getChatsByUserId = getChatsByUserId
exports.updateChat = updateChat