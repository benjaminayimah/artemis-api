const path = require('path');
const fs = require('fs').promises; // Use promises API for simplicity

module.exports = {
    deleteFile: async (file) => {
        const filePath = path.join(__dirname, '../uploads', file);

        try {
            // Check if the file exists
            await fs.access(filePath); // Throws an error if the file doesn't exist

            // Delete the file
            await fs.unlink(filePath);

            return { success: true, message: 'File deleted successfully' };
        } catch (err) {
            if (err.code === 'ENOENT') {
                // File not found
                return { success: false, message: 'File not found' };
            }
            // Other errors
            return { success: false, message: 'Failed to delete the file', error: err.message };
        }
    },
};
