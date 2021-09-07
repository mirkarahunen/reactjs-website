const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const Pusher = require("pusher");
const messageControllers = require('../controllers/messages-controllers');
/* -------------------------------------------------------------- */
// Define pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: process.env.PUSHER_APP_USE_TLS
});
/* -------------------------------------------------------------- */
// authenticate pusher app 
router.post('/pusher/auth', function(req, res) {

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const auth = pusher.authenticate(socketId, channel);
  res.send(auth);

});
/* -------------------------------------------------------------- */
// Create a new message and chat
router.post('/:id', messageControllers.createMessage);
/* -------------------------------------------------------------- */
// Post a message to a chat that already exists
router.patch('/:id', messageControllers.updateChat);
/* -------------------------------------------------------------- */
// Get users chats
router.get('/user/:userId', messageControllers.getChatsByUserId)
/* -------------------------------------------------------------- */
// Get chat messages
router.get('/:chatID', messageControllers.getChatMessagesByChatID);

/* -------------------------------------------------------------- */
module.exports = router