const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');

// Upload a single image
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // The image URL is available in req.file.path
        res.json({
            message: 'Image uploaded successfully',
            imageUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
});

// Get all images
router.get('/images', async (req, res) => {
    try {
        const result = await cloudinary.search
            .expression('folder:retry-demo/*')
            .sort_by('created_at', 'desc')
            .max_results(30)
            .execute();
        
        res.json(result.resources);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Error fetching images', error: error.message });
    }
});

// Get a specific image by public ID
router.get('/images/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;
        const result = await cloudinary.api.resource(publicId);
        res.json(result);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Error fetching image', error: error.message });
    }
});

// Delete an image
router.delete('/images/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;
        const result = await cloudinary.uploader.destroy(publicId);
        res.json({ message: 'Image deleted successfully', result });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Error deleting image', error: error.message });
    }
});

module.exports = router; 