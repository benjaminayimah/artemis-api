const path = require('path');
const fs = require('fs')


exports.uploadImage =  async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `${process.env.APP_URL}/uploads/${req.file.filename}`;
    return res.status(200).json({ imageUrl });
}

exports.deleteImage = async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'File not found' });
        }
        // Delete the file
        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to delete the file' });
            }
            return res.status(200).json({ message: 'File deleted successfully' });
        });
    });
}
