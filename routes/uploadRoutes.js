const express = require('express');
const router = express.Router();

const upload = require('../middlewares/fileUpload'); 

const UploadsController = require('../controllers/UploadsController');


router.post('/upload-image', upload.single('image'), UploadsController.uploadImage);
router.delete('/delete-image/:filename', UploadsController.deleteImage)


module.exports = router
