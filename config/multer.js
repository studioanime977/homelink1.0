const path   = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (_, __, cb) =>
    cb(null, path.join(__dirname, '..', 'public', 'img', 'usuarios')),
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

module.exports = multer({ storage });
