const express = require('express');
const { check } = require('express-validator')

const commentControllers = require('../controllers/comment-controllers')

const router = express.Router();

/* -------------------------------------------------------------- */
// Get all comments
router.get('/', commentControllers.getComments)

/* -------------------------------------------------------------- */
// Get comments by id
router.get('/:id', commentControllers.getCommenstById)

/* -------------------------------------------------------------- */
// Get comments by user id
router.get('/:uid', commentControllers.getCommentsByUserId)

/* -------------------------------------------------------------- */
// Create new playlist
router.post(
    '/',
    [
      check('content')
        .not()
        .isEmpty()
        .isLength({ min: 2 })
    ],
    commentControllers.createComment
  );

/* -------------------------------------------------------------- */
// Update comment
router.patch(
  '/:id', [
    check('content')
      .not()
      .isEmpty()
      .isLength({ min: 2 })
    ],
  commentControllers.updateComment
)


/* -------------------------------------------------------------- */
// Delete comment
router.delete('/:id', commentControllers.deleteComment);

/* -------------------------------------------------------------- */
module.exports = router;