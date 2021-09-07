// User validation and auth
const { validationResult } = require('express-validator');
const fs = require('fs');
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import user model
const User = require('../models/user');
const Playlist = require('../models/playlist')
const Comment = require('../models/comment')
const HttpError = require('../models/http-error')

/* -------------------------------------------------------------- */
// Get user by id
const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  
  let user;
  try {
    // Find user with user id
    user = await User.findById(userId)
    
  } catch(err) {
    const error = new HttpError('Something went wrong. Could not fetch the user')
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find a user with the id.')
    return next(error)
  }
// Return user information as object
  res.json({ user: user.toObject({ getters: true }) })
}

/* -------------------------------------------------------------- */
// Get all users
const getUsers = async (req, res, next) => {
  let users;
  try {
    // Find users and do not show password
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching users failed, please try again later.');
    return next(error);
  }
  // Converting response back to JavaScript Object and removing underscore before the id
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

/* -------------------------------------------------------------- */
// Register new users
const signup = async (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.')
    );
  }

  // Setting request body
  const { firstname, lastname, email, password, image, role, activate, matches, chatIDs } = req.body;

  // Check if user already exists in the db
  let existingUser;
  try {
    // Find user with the same email address
    existingUser = await User.findOne({ email: email });
    
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.');
    return next(error);
  }

  // If user already exists, tell to login instead
  if (existingUser) {
    const error = new HttpError('User exists already, please login instead.');
    return next(error);
  }

  // Encrypt password before saving to the db
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user, please try again.');
    return next(error);
  }

  // Create a new user with user model and set data with data from request body
  const createdUser = new User({
    role: "User",
    firstname,
    lastname,
    activate: false,
    email,
    password: hashedPassword,
    image: "uploads/images/default.jpg",
    playlists: [],
    comments: [],
    matches: [],
    chatIDs: [] 
  });

  try {
    // Set session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Save created user
    await createdUser.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Signing up failed, please try again later.');
    return next(error);
  }

  // Require Nodemailer to send email to the registered user
const nodemailer = require('nodemailer');

// Create transporter and default for the mail to be sent 
const transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    user: `${process.env.NODEMAIL_MAIL}`,
    pass: `${process.env.NODEMAIL_PASS}` 
  }
});

// Mail information
const mailOptions = {
  from: `${process.env.NODEMAIL_MAIL}`,
  to: createdUser.email,
  subject: 'Activate your account',
  text: `Activate your Beats account by clicking on this link: http://localhost:3000/account_activation/${createdUser.id}`
};

// Send email
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
	console.log('Error happended:' + error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

// Return the user info of new user and show in the console as json
res.status(200).json({ 
  userId: createdUser.id, 
  role: createdUser.role,
  activate: createdUser.activate,
  firstname: createdUser.firstname,
  lastname: createdUser.lastname,
  email: createdUser.email, 
  image: createdUser.image
});
};

/* -------------------------------------------------------------- */
// Login user
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
// Find existing user in the db with email address
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Logging in failed, please try again later.');
    return next(error);
  }

  // If user with information not found, show an error
  if (!existingUser) {
    const error = new HttpError('Invalid email, could not log you in.');
    return next(error);
  }

  // Validating password when logging in
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError('Could not log you in, please check your credentials and try again.');
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid password, could not log you in.');
    return next(error);
  }

  if (!existingUser.activate) {
    const error = new HttpError('User account is not yet activated. Check your email to activate your account.');
    return next(error);
  } 

  // Create a Json Web Token for logged in users and to be valid for 1 hour
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError('Logging in failed, please try again later.');
    return next(error);
  }

  // show the logged in user data in the console as json
 res.json({
    userId: existingUser.id,
    email: existingUser.email,
    firstname: existingUser.firstname,
    role: existingUser.role,
    image: existingUser.image,
    token: token
  });

};

/* -------------------------------------------------------------- */
// Update user
const updateUser = async (req, res, next) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.')
    );
  }

  // Set new request body 
  const { firstname, lastname, email, password, image, activate, matches } = req.body;

  // Set user id of the user whose information is to be updated
  const userId = req.params.userId;
  //console.log(userId);

  let user;
  try {
    // Find user with user id
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update user.');
    return next(error);
  }
//console.log(user);
  // Encrypt password before saving to the db
  let hashedPassword;
  if (hashedPassword) {
   try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not update user, please try again.');
    return next(error);
  }
}

// Set user information with the request body
try{
  if (req.body = image, activate, firstname, lastname, email, password) {
    user.image = image || req.file.path
    user.activate = activate
    user.firstname = firstname
    user.lastname = lastname
    user.email = email
    user.password = password
    //user.matches = matches
  } else {
    user.activate = activate
    //user.matches = matches
  }
} catch(err) {
  console.log(err)
    const error = new HttpError('Something went wrong')
}
  
  // Save updated user information to the db
  try {
    // Set session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await user.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Something went wrong, could not update user.')
    return next(error);
  }

  // Return updated user information as an object
  res.status(200).json({ user: user.toObject({ getters: true }) });

}

/* -------------------------------------------------------------- */
// Update matches
const updateMatches = async (req, res, next) => {
 
  // Set new request body 
  const { matches } = req.body;

  // Set user id of the user whose information is to be updated
  const userId = req.params.userId;

  let user;
  let otherUser
  // Find current user and user witth match with their user ids
  try {
    user = await User.findById(userId);
    otherUser = await User.findById(req.body.matches.matchID)

  } catch (err) {
    const error = new HttpError('Something went wrong, could not update user.');
    return next(error);
  }

  // Push new match to user
  let matchID = req.body.matches.matchID;
  let matchFirstname;
  let token;

  // Create a random ID for the match and a chat
  require('crypto').randomBytes(12, (err, buffer) => {
    token = buffer.toString('hex');
  });


if(req.body.matches.matchID) {
  // Check if matches array already has the user ID
  if(user.matches.map(item => item.userID).includes(matchID)) {
    try {    
    const error = new HttpError('This person already exists in likes.');
    console.log('This person already exists in likes.');
    return;
  } catch(error) {}
  } else  {
    //Find right user with matchID and push match user information to matches array for both users
    User.findOne({ _id: matchID }, function(err, result) {

      matchFirstname = result.firstname
      if (err) console.log(err)
    
    user.matches.push({"id": token, "userID": matchID, "name": matchFirstname})
    otherUser.matches.push({"id": token, "userID": userId, "name": user.firstname})
    })
  }
} 

  // Save updated user information to the db
  try {
     // Set session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Save updated to current user and to user with match
    await user.save({session: sess});
    await otherUser.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Something went wrong, could not update user.')
    return next(error);
  }
  // Return response as object
  res.status(200).json({ user: user.toObject({ getters: true }) });

}

/* -------------------------------------------------------------- */
// Delete user
const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;


  let user;
  try {
    // Find user with user id
    user = await User.findById(userId)
  } catch (err) {
    const error = new HttpError(
      'could not delete user.');
    return next(error);
  }

  //console.log(user.playlists)
  if (!userId) {
    const error = new HttpError('Could not find user for this id.');
    return next(error);
  }
  // Find user image 
  const imagePath = user.image;

  try {
    // Set session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    // Delete user from db
    await user.remove({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete user.');
    return next(error);
  }

  // If user had own uploaded image, unlink the image
 if (imagePath !== 'uploads/images/default.jpg')
  fs.unlink(imagePath, err => {
    console.log(err);
  });
  // Return deleted user
  res.status(200).json({ message: `Deleted user: ${userId}` });
  
};

/* -------------------------------------------------------------- */
exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser
exports.deleteUser = deleteUser
exports.updateMatches = updateMatches