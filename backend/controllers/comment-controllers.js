// User validation and auth
const { validationResult } = require('express-validator');
const mongoose = require('mongoose')
const HttpError = require('../models/http-error')
// Import models
const Comment = require('../models/comment')
const User = require('../models/user')
const Playlist = require('../models/playlist')

/* -------------------------------------------------------------- */
// Get all comments
const getComments = async (req, res, next) => {
    
    let comments;
    try {
      // Find users and do not show password
      comments = await Comment.find({});

    } catch (err) {
      const error = new HttpError('Fetching playlists failed, please try again later.');
      return next(error);
    }
    // Converting response back to JavaScript Object and removing underscore before the id
    res.json({ comments: comments.map(comment => comment.toObject({ getters: true })) });
  }

/* -------------------------------------------------------------- */
// Get comment by id
const getCommenstById = async (req, res, next) => {
  const id = req.params.id;
  //console.log(req.params)
  
  let comment;
  let playlistWithComments;

  // Find comment with ID or playlist with ID that has comment ID
  try {
    comment = await Comment.findById(id) || await Playlist.findById(id).populate('comments')
    //console.log(comment)
  } catch(err) {
    const error = new HttpError('Something went wrong. Could not fetch the comment')
    return next(error);
  }

  if (!comment) {
    const error = new HttpError('Could not find a comment with the id.')
    return next(error)
  }

  res.json({ comment: comment.toObject({ getters: true }) }) 
  || 
  res.json({
    comments: playlistWithComments.comments.map(comment =>
      comment.toObject({ getters: true })
    )
  })
  
}
  

 /* -------------------------------------------------------------- */
// Get comment by user id
const getCommentsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let UserWithComments;
  // Find a user with comments
  try {
    UserWithComments = await User.findById(userId).populate('comments');
    //console.log(UserWithComments)

  } catch (err) {
    const error = new HttpError('Fetching comments for this playlist failed, please try again later.');
    return next(error);
  }
  // Converting response back to JavaScript Object and removing underscore before the id
  res.json({
    comments: UserWithComments.comments.map(comment =>
      comment.toObject({ getters: true })
    )
  })
  
}
  
/* -------------------------------------------------------------- */
// Create new comment
const createComment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.'));
    }

    const { content } = req.body;
    let date = new Date()

    // Create a new comment with the comment model and set data
    const createdComment = new Comment({
      content,
      writerId: req.body.writerId,
      writer: req.body.writer,
      writerImage: req.body.writerImage,
      playlist: req.body.playlist,
      created_at: date.toDateString()
    });
    
    let user;
    let playlist;
    try {
      // find the right user who commented and the right playlist on which the comment was posted
      user = await User.findById(req.body.writerId);
      playlist = await Playlist.findById(req.body.playlist)

    } catch (err) {
      const error = new HttpError(
        'Creating a new comment failed, please try again.');
      return next(error);
    }

    if (!user) {
      const error = new HttpError('Could not find user for provided id.');
      return next(error);
    }

    if (!playlist) {
      const error = new HttpError('Could not find playlist with provided id.');
      return next(error);
    }
  
    try {
      // Start session to save the new comment 
      const sess = await mongoose.startSession();
      sess.startTransaction();
      //Save comment
      await createdComment.save({ session: sess });
      // Push new comment to the user information and playlist information
     user.comments.push(createdComment);
      playlist.comments.push(createdComment)

      // Save changes
      await user.save({ session: sess });
      await playlist.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        'Creating the new comment failed, please try again.');
      return next(error);
    }
  
    // Return saved information
    res.status(201).json({ comments: createdComment });
  };

/* -------------------------------------------------------------- */
// Update comment
const updateComment = async (req, res, next) => {

  // Create an error if inputs are empty
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.')
    );
  }

  // Set new request body 
  const { content } = req.body;
  
  // Set user id of the user whose information is to be updated
  const commentId = req.params.id;
  //console.log(commentId)

  let comment;
  try {
    // Find the comment with id to be updated
    comment = await Comment.findById(commentId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update comment.');
    return next(error);
  }
  //console.log(comment.content)
  // Set comment content from the request body
  comment.content = content
  //console.log(content)
  
  // Save updated user information to the db
  try {
    // Start session to save the new comment 
    const sess = await mongoose.startSession();
    sess.startTransaction();

    // Save changes
    await comment.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update the comment.')
    return next(error);
  }

  // Return updated comment information
  res.status(200).json({ comment: comment.toObject({ getters: true }) });
}


/* -------------------------------------------------------------- */
// Delete comment
const deleteComment = async (req, res, next) => {
  const commentId = req.params.id;

  let comment;
  try {
    // Find the comment to be deleted with its ID in the comment collection
    // Remove comment from the user collection by creating a relationship with populate method
    comment = await Comment.findById(commentId).populate(['writerId', 'playlist']);

    //console.log(comment)

  } catch (err) {
    //console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete comment.');
    return next(error);
  }

  // Check if the playlist with the given id exists
  if (!comment) {
    const error = new HttpError('Could not find comment for this id.');
    return next(error);
  }
  
  try {
    // create constant for the current session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    
    // Remove comment from the comment collection by using the current session
    await comment.remove({ session: sess });

    // Access comment stored in writer and pull the comment
    comment.writerId.comments.pull(comment)

    // Remove playlist from the user collection
    await comment.writerId.save({ session: sess });

    // If successful, commit transaction
    await sess.commitTransaction();

  } catch (err) {
    //console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete comment.');
    return next(error);
  }

  // Return deleted comment information
  res.status(200).json({ message: 'Deleted comment.' });
 
};
  
/* -------------------------------------------------------------- */
exports.getComments = getComments;
exports.getCommenstById = getCommenstById;
exports.createComment = createComment;
exports.getCommentsByUserId = getCommentsByUserId;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;