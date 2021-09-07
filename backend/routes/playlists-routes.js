const express = require('express');
const { check } = require('express-validator');

const playlistControllers = require('../controllers/playlist-controllers');

const router = express.Router();


/* -------------------------------------------------------------- */
// Get playlists
router.get('/user/:uid', playlistControllers.getPlaylistByUserId);

/* -------------------------------------------------------------- */
// Get playlist by ID
router.get('/:id', playlistControllers.getPlaylistByPlaylistId);

/* -------------------------------------------------------------- */
// Get all playlists
router.get('/', playlistControllers.getPlaylists)

/* -------------------------------------------------------------- */
// Create new playlist
router.post(
    '/',
    [
      check('name')
        .not()
        .isEmpty()
        .isLength({ min: 2 })
    ],
    playlistControllers.createPlaylist
  );

/* -------------------------------------------------------------- */
// Update playlist
router.post('/:pid', playlistControllers.updatePlaylist)

/* -------------------------------------------------------------- */
// Delete playlist
  router.delete('/:pid', playlistControllers.deletePlaylist);

/* -------------------------------------------------------------- */
module.exports = router