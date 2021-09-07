const multer = require('multer');
const uuid = require('uuid/v1');
/* -------------------------------------------------------------- */
// Accept the following file types
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

/* -------------------------------------------------------------- */
const fileUpload = multer({

  // Limit the file size to 
  limits: 500000,

  // Set file storage
  storage: multer.diskStorage({
    destination: (req, file, cb) => {

      // File storage path
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];

      // Generate new, random file name
      cb(null, uuid() + '.' + ext);
    }
  }),
  // Validate uploaded file
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
  
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

/* -------------------------------------------------------------- */
module.exports = fileUpload;
