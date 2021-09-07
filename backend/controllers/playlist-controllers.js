// User validation and auth
const { validationResult } = require('express-validator');
const mongoose = require('mongoose')
const HttpError = require('../models/http-error')
// Import user model
const Playlist = require('../models/playlist')
const User = require('../models/user')


/* -------------------------------------------------------------- */
// Get all playlists
const getPlaylists = async (req, res, next) => {
    
  let playlists;
  try {
    // Find all playlists 
    playlists = await Playlist.find({});
    //console.log(playlists)
  } catch (err) {
    const error = new HttpError('Fetching playlists failed, please try again later.');
    return next(error);
  }
  // Converting response back to JavaScript Object and removing underscore before the id
  res.json({ playlists: playlists.map(playlist => playlist.toObject({ getters: true })) });
}


/* -------------------------------------------------------------- */
// Get playlist by user id
const getPlaylistByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaylists;
  try {
    // Finding a user with the userId to match with playlists
      userWithPlaylists = await User.findById(userId).populate('playlists');
      
  } catch (err) {
    const error = new HttpError('Fetching playlists failed, please try again later.');
    return next(error);
  }
// Return users playlists
  res.json({
    playlists: userWithPlaylists.playlists.map(playlist =>
      playlist.toObject({ getters: true })
    )
  })
}

/* -------------------------------------------------------------- */
// Get playlist by playlist id
const getPlaylistByPlaylistId = async (req, res, next) => {
  const id = req.params.id;

  let playlist;
  try {
    // Find users and do not show password
    playlist = await Playlist.findById(id);
    //console.log(playlist)
  } catch (err) {
    const error = new HttpError('Fetching playlists failed, please try again later.');
    return next(error);
  }
  // Converting response back to JavaScript Object and removing underscore before the id
  res.json({ playlist: playlist.toObject({ getters: true }) })

}

/* -------------------------------------------------------------- */
// Create new playlist
  const createPlaylist = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.'));
    }
   
    const { name, playlistTracks, likes } = req.body;
  
    // Create a new playlist with playlist model and set content from request body
    const createdPlaylist = new Playlist({
      name,
      playlistTracks,
      creatorId: req.body.creatorId,
      creator: req.body.creator,
      likes
    });

    //console.log(createdPlaylist)
    
    let user;
    try {
      // Find the right user with user id
      user = await User.findById(req.body.creatorId);
      //console.log(user)
    } catch (err) {
      const error = new HttpError(
        'Creating a new playlist failed, please try again.');
      return next(error);
    }

    if (!user) {
      const error = new HttpError('Could not find user for provided id.');
      return next(error);
    }
  
    try {
      // create constant for the current session
      const sess = await mongoose.startSession();

      sess.startTransaction();
      await createdPlaylist.save({ session: sess });

      // Push new playlist to the user
      user.playlists.unshift(createdPlaylist);

      // Save new playlist 
      await user.save({ session: sess });

      // If successful, commit transaction
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Creating playlist failed, please try again.');
      return next(error);
    }
    // Return created playlist
    res.status(201).json({ playlist: createdPlaylist });
  };

/* -------------------------------------------------------------- */
// Update playlist
const updatePlaylist = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.')
    );
  }

  // Set new request body 
  let { likes } = req.body;
  
  // Set user id of the user whose information is to be updated
  const playlistId = req.params.pid;

  let playlist;
  try {
    playlist = await Playlist.findById(playlistId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update playlist likes.');
    return next(error);
  }

  // Push new like to the playlist
  playlist.likes.push(likes);
  
  // Save updated user information to the db
  try {
    // create constant for the current session
    const sess = await mongoose.startSession();

    sess.startTransaction();
    await playlist.save({session: sess});
    // If successful, commit transaction
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError('Something went wrong, could not update playlist.')
    return next(error);
  }
// Return updated playlist information
  res.status(200).json({ playlist: playlist.toObject({ getters: true }) });
  
}  

/* -------------------------------------------------------------- */
// Create Playlist match

const playlistMatch = async (req, res, next) => {
  
  let playlists;
  try {
    // Find playlists 
    playlists = await Playlist.find({});
    //console.log(playlists)
  } catch (err) {
    const error = new HttpError('Fetching playlists failed, please try again later.');
    return next(error);
  }
  // Converting response back to JavaScript Object and removing underscore before the id
  res.json({ playlists: playlists.map(playlist => playlist.toObject({ getters: true })) });
}

/* -------------------------------------------------------------- */
// Delete playlist
  const deletePlaylist = async (req, res, next) => {
    const playlistId = req.params.pid;
 
    let playlist;
    try {
      // Find the playlist to be deleted with its ID in the playlist schema
      // Remove playlist from the user schema by creating a relationship with populate method
      playlist = await Playlist.findById(playlistId).populate(['creatorId', 'comments']);

      //console.log(playlist)

    } catch (err) {
      //console.log(err)
      const error = new HttpError(
        'Something went wrong, could not delete playlist.');
      return next(error);
    }
  
    // Check if the playlist with the given id exists
    if (!playlist) {
      const error = new HttpError('Could not find playlist for this id.');
      return next(error);
    }
    
    try {
      // create constant for the current session
      const sess = await mongoose.startSession();
      sess.startTransaction();
      
      // Remove playlist from the playlist collection by using the current session
      await playlist.remove({ session: sess });

      // Access playlist stored in creator and pull the playlist
      playlist.creatorId.playlists.pull(playlist)

      // Remove playlist from the user collection
      await playlist.creatorId.save({ session: sess });

      // If successful, commit transaction
      await sess.commitTransaction();

    } catch (err) {
      //console.log(err)
      const error = new HttpError(
        'Something went wrong, could not delete playlist.');
      return next(error);
    }

    res.status(200).json({ message: 'Deleted playlist.' });
   
  };
  
/* -------------------------------------------------------------- */
exports.getPlaylists = getPlaylists;
exports.getPlaylistByUserId = getPlaylistByUserId;
exports.getPlaylistByPlaylistId = getPlaylistByPlaylistId;
exports.createPlaylist = createPlaylist;
exports.updatePlaylist = updatePlaylist;
exports.playlistMatch = playlistMatch;
exports.deletePlaylist = deletePlaylist;