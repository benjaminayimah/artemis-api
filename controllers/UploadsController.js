
const { deleteFile } = require('../utils/DeleteFileTrait');


exports.uploadImage =  async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `${process.env.APP_URL}/uploads/${req.file.filename}`;
    return res.status(200).json({ imageUrl });
}

exports.deleteImage = async (req, res) => {
    const filename = req.params.filename;

    try {
        const result = await deleteFile(filename);

        if (result.success) {
            return res.status(200).json({ message: result.message });
        } else {
            return res.status(404).json({ message: result.message });
        }
    } catch (error) {
        return res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
    }
}
