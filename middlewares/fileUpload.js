const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for storing images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});


// Initialize multer with storage configuration
const upload = multer({ storage: storage })

module.exports = upload
