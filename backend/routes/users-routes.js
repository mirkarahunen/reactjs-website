const express = require('express');
const { check } = require('express-validator');

// Import controllers
const usersController = require('../controllers/users-controllers');

// Import middleware for fileupload
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

/* -------------------------------------------------------------- */
// Get users
router.get('/', usersController.getUsers)

/* -------------------------------------------------------------- */
// Get user by id
router.get('/:id', usersController.getUserById)

/* -------------------------------------------------------------- */
// Post new user
router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('firstname')
      .not()
      .isEmpty(),
      check('lastname')
      .not()
      .isEmpty(),
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 8 })
  ],
  usersController.signup
)

/* -------------------------------------------------------------- */
// Post login request
router.post('/login', usersController.login)

/* -------------------------------------------------------------- */
// Update user
router.patch(
  '/:userId',
  fileUpload.single('image'),
  usersController.updateUser
)

router.patch('/:userId/:token', usersController.updateMatches)

/* -------------------------------------------------------------- */
// Delete playlist
router.delete('/:uid', usersController.deleteUser);

/* -------------------------------------------------------------- */
module.exports = router;
